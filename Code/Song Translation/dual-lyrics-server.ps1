[CmdletBinding()]
param(
    [int]$Port = 8974,
    [string]$TargetLanguage = "en",
    [ValidateSet("googleweb", "none", "libretranslate")]
    [string]$TranslationProvider = "googleweb",
    [switch]$OpenBrowser
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Import-Module (Join-Path $projectRoot "SpotifyLyrics.Core.psm1") -Force -DisableNameChecking
[Console]::TreatControlCAsInput = $false
$buildFiles = @(
    (Join-Path $projectRoot "dual-lyrics-server.ps1")
    (Join-Path $projectRoot "dual-lyrics.ps1")
    (Join-Path $projectRoot "SpotifyLyrics.Core.psm1")
    (Join-Path $projectRoot "app\\index.html")
    (Join-Path $projectRoot "app\\styles.css")
    (Join-Path $projectRoot "app\\app.js")
) | Where-Object { Test-Path -LiteralPath $_ }
$script:serverBuild = (
    Get-Item -LiteralPath $buildFiles |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1 -ExpandProperty LastWriteTime
).ToString("o")

$appRoot = Join-Path $projectRoot "app"
$translationCache = @{}
$script:cachedTrackKey = ""
$script:cachedLyrics = $null
$script:lyricsStateByTrackKey = @{}
$script:lastLyricsLookupAttempts = @()
$script:lastLyricsLookupError = ""
$script:lyricsLookupJob = $null
$script:lyricsLookupRequestKey = ""
$script:cachedArtworkTrackKey = ""
$script:cachedArtworkUrl = ""
$script:artworkCacheBySearchKey = @{}
$script:currentTargetLanguage = $TargetLanguage
$script:currentTranslationProvider = $TranslationProvider
$script:syncedLyricsLeadMs = 1000
$script:languageChoices = @(
    @{ code = "en"; label = "English" },
    @{ code = "es"; label = "Spanish" },
    @{ code = "fr"; label = "French" },
    @{ code = "de"; label = "German" },
    @{ code = "it"; label = "Italian" },
    @{ code = "pt"; label = "Portuguese" },
    @{ code = "ja"; label = "Japanese" },
    @{ code = "ko"; label = "Korean" },
    @{ code = "zh-CN"; label = "Chinese (Simplified)" }
)

function Get-ContentType {
    param([string]$Path)

    switch ([IO.Path]::GetExtension($Path).ToLowerInvariant()) {
        ".html" { "text/html; charset=utf-8" }
        ".css" { "text/css; charset=utf-8" }
        ".js" { "application/javascript; charset=utf-8" }
        ".json" { "application/json; charset=utf-8" }
        default { "application/octet-stream" }
    }
}

function Write-HttpResponse {
    param(
        [Parameter(Mandatory = $true)]
        [System.Net.Sockets.NetworkStream]$Stream,

        [Parameter(Mandatory = $true)]
        [byte[]]$BodyBytes,

        [string]$ContentType = "application/octet-stream",
        [int]$StatusCode = 200,
        [string]$StatusText = "OK"
    )

    $headerText = @(
        "HTTP/1.1 $StatusCode $StatusText"
        "Content-Type: $ContentType"
        "Content-Length: $($BodyBytes.Length)"
        "Cache-Control: no-store, no-cache, must-revalidate, max-age=0"
        "Pragma: no-cache"
        "Expires: 0"
        "Connection: close"
        ""
        ""
    ) -join "`r`n"

    $headerBytes = [Text.Encoding]::ASCII.GetBytes($headerText)

    try {
        $Stream.Write($headerBytes, 0, $headerBytes.Length)
        $Stream.Write($BodyBytes, 0, $BodyBytes.Length)
        $Stream.Flush()
    }
    catch [System.IO.IOException] {
        # The client closed the connection before reading the full response.
    }
    catch [System.ObjectDisposedException] {
        # The stream was already closed by the client.
    }
}

function Write-JsonResponse {
    param(
        [Parameter(Mandatory = $true)]
        [System.Net.Sockets.NetworkStream]$Stream,

        [Parameter(Mandatory = $true)]
        [object]$Data,

        [int]$StatusCode = 200,
        [string]$StatusText = "OK"
    )

    $json = $Data | ConvertTo-Json -Depth 8
    $bytes = [Text.Encoding]::UTF8.GetBytes($json)
    Write-HttpResponse -Stream $Stream -BodyBytes $bytes -ContentType "application/json; charset=utf-8" -StatusCode $StatusCode -StatusText $StatusText
}

function Write-FileResponse {
    param(
        [Parameter(Mandatory = $true)]
        [System.Net.Sockets.NetworkStream]$Stream,

        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    $bytes = [IO.File]::ReadAllBytes($Path)
    Write-HttpResponse -Stream $Stream -BodyBytes $bytes -ContentType (Get-ContentType -Path $Path)
}

function Get-ArtworkCacheKey {
    param(
        [string]$Artist,
        [string]$Album,
        [string]$Title
    )

    return "{0}|{1}|{2}" -f `
        ([string]$Artist).Trim().ToLowerInvariant(), `
        ([string]$Album).Trim().ToLowerInvariant(), `
        ([string]$Title).Trim().ToLowerInvariant()
}

function Get-LineLanguageCodes {
    param(
        [object]$LyricsData
    )

    if ($null -eq $LyricsData) {
        return @()
    }

    return @(
        @($LyricsData.Synced) | ForEach-Object { [string]$_.SourceLanguage }
        @($LyricsData.Plain) | ForEach-Object { [string]$_.SourceLanguage }
    ) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | ForEach-Object {
        if ($_ -match '^[a-z]{2}') { $matches[0] } else { $_ }
    } | Select-Object -Unique
}

function Test-SongNeedsTranslation {
    param(
        [object]$LyricsData,
        [string]$TargetLanguage
    )

    $lineLanguageCodes = @(Get-LineLanguageCodes -LyricsData $LyricsData)
    foreach ($languageCode in $lineLanguageCodes) {
        if (-not [string]::IsNullOrWhiteSpace($languageCode) -and ($TargetLanguage -notlike "$languageCode*") -and ($languageCode -notlike "$($TargetLanguage)*")) {
            return $true
        }
    }

    return $false
}

function Convert-DisplayLyricsToApiPayload {
    param(
        [object]$LyricsData,
        [string]$FallbackMode = "missing",
        [object[]]$LookupAttempts = @(),
        [string]$LookupError = ""
    )

    $mode = $FallbackMode
    if ($null -ne $LyricsData) {
        if (@($LyricsData.Synced).Count -gt 0) {
            $mode = "synced"
        }
        elseif (@($LyricsData.Plain).Count -gt 0) {
            $mode = "plain"
        }
    }

    $syncedPayload = if ($null -ne $LyricsData) {
        @(
            foreach ($entry in @($LyricsData.Synced)) {
                [pscustomobject]@{
                    timestampMs = [Math]::Max(0, [int]$entry.TimestampMs - $script:syncedLyricsLeadMs)
                    text = $entry.Text
                    translation = $entry.Translation
                    phonetic = $entry.Phonetic
                    sourceLanguage = $entry.SourceLanguage
                }
            }
        )
    }
    else {
        @()
    }

    $plainPayload = if ($null -ne $LyricsData) {
        @(
            foreach ($line in @($LyricsData.Plain)) {
                [pscustomobject]@{
                    text = $line.Text
                    translation = $line.Translation
                    phonetic = $line.Phonetic
                    sourceLanguage = $line.SourceLanguage
                }
            }
        )
    }
    else {
        @()
    }

    $providerName = ""
    if ($null -ne $LyricsData -and $null -ne $LyricsData.Raw) {
        $providerProp = $LyricsData.Raw.PSObject.Properties["provider"]
        if ($null -ne $providerProp -and -not [string]::IsNullOrWhiteSpace([string]$providerProp.Value)) {
            $providerName = [string]$providerProp.Value
        }
        else {
            $providerName = "lrclib"
        }
    }

    $songNeedsTranslation = if ($null -ne $LyricsData) {
        Test-SongNeedsTranslation -LyricsData $LyricsData -TargetLanguage $script:currentTargetLanguage
    }
    else {
        $false
    }

    return [pscustomobject]@{
        mode = $mode
        synced = $syncedPayload
        plain = $plainPayload
        sourceLanguage = if ($null -ne $LyricsData) { $LyricsData.SourceLanguage } else { "" }
        translationVisible = $songNeedsTranslation
        provider = $providerName
        debug = [pscustomobject]@{
            lookupAttempts = @($LookupAttempts)
            lookupError = $LookupError
            serverBuild = $script:serverBuild
        }
    }
}

function New-LyricsStateEntry {
    param(
        [bool]$Completed = $false,
        [object]$LyricsData = $null,
        [object[]]$LookupAttempts = @(),
        [string]$LookupError = ""
    )

    return [pscustomobject]@{
        completed = $Completed
        lyricsData = $LyricsData
        lookupAttempts = @($LookupAttempts)
        lookupError = $LookupError
    }
}

function Get-LyricsRequestKey {
    param(
        [string]$TrackKey,
        [string]$TargetLanguage,
        [string]$TranslationProvider
    )

    if ([string]::IsNullOrWhiteSpace($TrackKey)) {
        return ""
    }

    return "{0}|{1}|{2}" -f `
        $TrackKey.Trim(), `
        ([string]$TargetLanguage).Trim().ToLowerInvariant(), `
        ([string]$TranslationProvider).Trim().ToLowerInvariant()
}

function Stop-LyricsLookupJob {
    if ($null -eq $script:lyricsLookupJob) {
        return
    }

    try {
        if ($script:lyricsLookupJob.State -eq "Running") {
            Stop-Job -Job $script:lyricsLookupJob -ErrorAction SilentlyContinue | Out-Null
        }
    }
    finally {
        Remove-Job -Job $script:lyricsLookupJob -Force -ErrorAction SilentlyContinue | Out-Null
        $script:lyricsLookupJob = $null
        $script:lyricsLookupRequestKey = ""
    }
}

function Receive-LyricsLookupJobIfReady {
    if ($null -eq $script:lyricsLookupJob) {
        return
    }

    if ($script:lyricsLookupJob.State -in @("Running", "NotStarted")) {
        return
    }

    $job = $script:lyricsLookupJob
    $requestKey = $script:lyricsLookupRequestKey
    $script:lyricsLookupJob = $null
    $script:lyricsLookupRequestKey = ""

    try {
        $jobResult = Receive-Job -Job $job -ErrorAction Stop
    }
    catch {
        if (-not [string]::IsNullOrWhiteSpace($script:cachedTrackKey)) {
            $script:lyricsStateByTrackKey[$script:cachedTrackKey] = New-LyricsStateEntry `
                -Completed $true `
                -LyricsData $null `
                -LookupAttempts @() `
                -LookupError $_.Exception.Message
        }
        return
    }
    finally {
        Remove-Job -Job $job -Force -ErrorAction SilentlyContinue | Out-Null
    }

    if ($null -eq $jobResult -or [string]::IsNullOrWhiteSpace([string]$jobResult.TrackKey)) {
        return
    }

    if ($jobResult.RequestKey -ne $requestKey) {
        return
    }

    $expectedRequestKey = Get-LyricsRequestKey `
        -TrackKey ([string]$jobResult.TrackKey) `
        -TargetLanguage $script:currentTargetLanguage `
        -TranslationProvider $script:currentTranslationProvider

    if ($expectedRequestKey -ne $jobResult.RequestKey) {
        return
    }

    $script:lyricsStateByTrackKey[[string]$jobResult.TrackKey] = New-LyricsStateEntry `
        -Completed $true `
        -LyricsData $jobResult.LyricsData `
        -LookupAttempts @($jobResult.LookupAttempts) `
        -LookupError ([string]$jobResult.LookupError)
}

function Start-LyricsLookupJob {
    param(
        [string]$TrackKey,
        [string]$Title,
        [string]$Artist,
        [string]$Album,
        [int]$DurationMs = 0
    )

    $requestKey = Get-LyricsRequestKey `
        -TrackKey $TrackKey `
        -TargetLanguage $script:currentTargetLanguage `
        -TranslationProvider $script:currentTranslationProvider

    if ([string]::IsNullOrWhiteSpace($requestKey)) {
        return
    }

    if ($script:lyricsLookupRequestKey -eq $requestKey -and $null -ne $script:lyricsLookupJob) {
        return
    }

    Stop-LyricsLookupJob

    $modulePath = Join-Path $projectRoot "SpotifyLyrics.Core.psm1"
    $targetLanguage = $script:currentTargetLanguage
    $translationProvider = $script:currentTranslationProvider

    $script:lyricsLookupJob = Start-Job -ArgumentList @(
        $requestKey,
        $TrackKey,
        $Title,
        $Artist,
        $Album,
        $DurationMs,
        $modulePath,
        $targetLanguage,
        $translationProvider
    ) -ScriptBlock {
        param(
            [string]$RequestKey,
            [string]$TrackKey,
            [string]$Title,
            [string]$Artist,
            [string]$Album,
            [int]$DurationMs,
            [string]$ModulePath,
            [string]$TargetLanguage,
            [string]$TranslationProvider
        )

        Set-StrictMode -Version Latest
        $ErrorActionPreference = "Stop"
        Import-Module $ModulePath -Force -DisableNameChecking

        $track = [pscustomobject]@{
            Title = $Title
            Artist = $Artist
            Album = $Album
            EndTimeMs = $DurationMs
        }

        $translationCache = @{}
        $baseLyrics = Get-TrackLyricsData -Track $track
        $lookupAttempts = @(Get-LastLyricsLookupAttempts)
        $lookupError = Get-LastLyricsLookupError

        if ($null -eq $baseLyrics) {
            return [pscustomobject]@{
                RequestKey = $RequestKey
                TrackKey = $TrackKey
                TargetLanguage = $TargetLanguage
                TranslationProvider = $TranslationProvider
                LyricsData = $null
                LookupAttempts = @($lookupAttempts)
                LookupError = $lookupError
            }
        }

        try {
            $translatedLyrics = Add-TranslationsToLyrics `
                -LyricsData $baseLyrics `
                -TargetLanguage $TargetLanguage `
                -TranslationProvider $TranslationProvider `
                -TranslationCache $translationCache
        }
        catch {
            $translatedLyrics = Convert-LyricsDataToDisplayData -LyricsData $baseLyrics
        }

        return [pscustomobject]@{
            RequestKey = $RequestKey
            TrackKey = $TrackKey
            TargetLanguage = $TargetLanguage
            TranslationProvider = $TranslationProvider
            LyricsData = $translatedLyrics
            LookupAttempts = @($lookupAttempts)
            LookupError = $lookupError
        }
    }

    $script:lyricsLookupRequestKey = $requestKey
}

function Get-AppState {
    Receive-LyricsLookupJobIfReady
    $track = Get-SpotifyTrack
    if ($null -eq $track) {
        Stop-LyricsLookupJob
        $script:cachedTrackKey = ""
        $script:cachedLyrics = $null
        $script:lyricsStateByTrackKey = @{}
        $script:lastLyricsLookupAttempts = @()
        $script:lastLyricsLookupError = ""
        $script:cachedArtworkTrackKey = ""
        $script:cachedArtworkUrl = ""
        return [pscustomobject]@{
            status = "idle"
            timestampIso = (Get-Date).ToString("o")
            settings = @{
                targetLanguage = $script:currentTargetLanguage
                translationProvider = $script:currentTranslationProvider
                languageChoices = $script:languageChoices
                serverBuild = $script:serverBuild
            }
            track = $null
            lyrics = @{
                mode = "missing"
                synced = @()
                plain = @()
                sourceLanguage = ""
                translationVisible = $false
                provider = ""
            }
        }
    }

    if ($track.TrackKey -eq $script:cachedArtworkTrackKey -and [string]::IsNullOrWhiteSpace([string]$track.ArtworkUrl) -and -not [string]::IsNullOrWhiteSpace($script:cachedArtworkUrl)) {
        $track | Add-Member -NotePropertyName ArtworkUrl -NotePropertyValue $script:cachedArtworkUrl -Force
    }

    if ($track.TrackKey -ne $script:cachedTrackKey) {
        if ([string]::IsNullOrWhiteSpace([string]$track.ArtworkUrl) -and (-not [string]::IsNullOrWhiteSpace([string]$track.Artist)) -and (-not [string]::IsNullOrWhiteSpace([string]$track.Title))) {
            $artworkCacheKey = Get-ArtworkCacheKey -Artist $track.Artist -Album $track.Album -Title $track.Title
            if ($script:artworkCacheBySearchKey.ContainsKey($artworkCacheKey)) {
                $cachedArtwork = [string]$script:artworkCacheBySearchKey[$artworkCacheKey]
                if (-not [string]::IsNullOrWhiteSpace($cachedArtwork)) {
                    $track | Add-Member -NotePropertyName ArtworkUrl -NotePropertyValue $cachedArtwork -Force
                }
            }
            else {
                $fallbackArt = Get-AlbumArtFallbackUrl -Artist $track.Artist -Album $track.Album -Title $track.Title
                $script:artworkCacheBySearchKey[$artworkCacheKey] = [string]$fallbackArt
                if (-not [string]::IsNullOrWhiteSpace($fallbackArt)) {
                    $track | Add-Member -NotePropertyName ArtworkUrl -NotePropertyValue $fallbackArt -Force
                }
            }
        }

        $script:cachedArtworkTrackKey = $track.TrackKey
        $script:cachedArtworkUrl = [string]$track.ArtworkUrl

        $script:lastLyricsLookupAttempts = @()
        $script:lastLyricsLookupError = ""
        $script:cachedTrackKey = $track.TrackKey
    }

    $lyricsStateEntry = if ($script:lyricsStateByTrackKey.ContainsKey($track.TrackKey)) {
        $script:lyricsStateByTrackKey[$track.TrackKey]
    }
    else {
        $null
    }

    if ($null -ne $lyricsStateEntry) {
        $script:cachedLyrics = $lyricsStateEntry.lyricsData
        $script:lastLyricsLookupAttempts = @($lyricsStateEntry.lookupAttempts)
        $script:lastLyricsLookupError = [string]$lyricsStateEntry.lookupError
    }
    else {
        $script:cachedLyrics = $null
        $script:lastLyricsLookupAttempts = @()
        $script:lastLyricsLookupError = ""
    }

    if ($null -eq $lyricsStateEntry -and (-not [string]::IsNullOrWhiteSpace([string]$track.Title)) -and (-not [string]::IsNullOrWhiteSpace([string]$track.Artist))) {
        Start-LyricsLookupJob `
            -TrackKey ([string]$track.TrackKey) `
            -Title ([string]$track.Title) `
            -Artist ([string]$track.Artist) `
            -Album ([string]$track.Album) `
            -DurationMs ([int]$track.EndTimeMs)
    }

    $lyricsFallbackMode = if ($null -ne $lyricsStateEntry -and $lyricsStateEntry.completed) {
        "missing"
    }
    elseif (-not [string]::IsNullOrWhiteSpace([string]$track.Title) -and -not [string]::IsNullOrWhiteSpace([string]$track.Artist)) {
        "loading"
    }
    else {
        "missing"
    }

    return [pscustomobject]@{
        status = "active"
        timestampIso = (Get-Date).ToString("o")
        settings = @{
            targetLanguage = $script:currentTargetLanguage
            translationProvider = $script:currentTranslationProvider
            languageChoices = $script:languageChoices
            serverBuild = $script:serverBuild
        }
        track = [pscustomobject]@{
            trackKey = $track.TrackKey
            sourceApp = $track.SourceApp
            title = $track.Title
            artist = $track.Artist
            album = $track.Album
            artworkUrl = $track.ArtworkUrl
            playbackStatus = $track.PlaybackStatus
            positionMs = $track.PositionMs
            endTimeMs = $track.EndTimeMs
            lastUpdatedIso = $track.LastUpdatedIso
        }
        lyrics = Convert-DisplayLyricsToApiPayload -LyricsData $script:cachedLyrics -FallbackMode $lyricsFallbackMode -LookupAttempts $script:lastLyricsLookupAttempts -LookupError $script:lastLyricsLookupError
    }
}

function Get-DebugState {
    $spotifyProcesses = @(
        Get-Process Spotify -ErrorAction SilentlyContinue |
            Select-Object ProcessName, Id, MainWindowTitle, MainWindowHandle
    )

    $track = $null
    $trackError = ""
    try {
        $track = Get-SpotifyTrack
    }
    catch {
        $trackError = $_.Exception.Message
    }

    return [pscustomobject]@{
        timestampIso = (Get-Date).ToString("o")
        spotifyProcessCount = $spotifyProcesses.Count
        spotifyProcesses = $spotifyProcesses
        detectedTrack = $track
        detectedTrackError = $trackError
        lyricsLookupAttempts = @($script:lastLyricsLookupAttempts)
        lyricsLookupError = $script:lastLyricsLookupError
        serverBuild = $script:serverBuild
    }
}

function Get-LyricsApiPayload {
    param(
        [string]$TrackKey,
        [string]$Title,
        [string]$Artist,
        [string]$Album,
        [int]$DurationMs = 0
    )

    Receive-LyricsLookupJobIfReady

    if (-not [string]::IsNullOrWhiteSpace($TrackKey) -and $script:lyricsStateByTrackKey.ContainsKey($TrackKey)) {
        $lyricsStateEntry = $script:lyricsStateByTrackKey[$TrackKey]
        $fallbackMode = if ($lyricsStateEntry.completed) { "missing" } else { "loading" }
        return Convert-DisplayLyricsToApiPayload `
            -LyricsData $lyricsStateEntry.lyricsData `
            -FallbackMode $fallbackMode `
            -LookupAttempts @($lyricsStateEntry.lookupAttempts) `
            -LookupError ([string]$lyricsStateEntry.lookupError)
    }

    if ([string]::IsNullOrWhiteSpace($Title) -or [string]::IsNullOrWhiteSpace($Artist)) {
        return Convert-DisplayLyricsToApiPayload -LyricsData $null -FallbackMode "missing"
    }

    if (-not [string]::IsNullOrWhiteSpace($TrackKey)) {
        Start-LyricsLookupJob `
            -TrackKey $TrackKey `
            -Title $Title `
            -Artist $Artist `
            -Album $Album `
            -DurationMs $DurationMs
    }

    return Convert-DisplayLyricsToApiPayload -LyricsData $null -FallbackMode "loading"
}

function Get-AlignmentPayload {
    param(
        [string]$OriginalText,
        [string]$TranslatedText,
        [string]$SourceLanguage
    )

    if ([string]::IsNullOrWhiteSpace($OriginalText) -or [string]::IsNullOrWhiteSpace($TranslatedText)) {
        return [pscustomobject]@{
            pairs = @()
        }
    }

    return [pscustomobject]@{
        pairs = @(Get-TokenAlignments `
            -OriginalText $OriginalText `
            -TranslatedText $TranslatedText `
            -SourceLanguage $SourceLanguage `
            -TargetLanguage $script:currentTargetLanguage `
            -TranslationProvider $script:currentTranslationProvider `
            -TranslationCache $translationCache)
    }
}

function Update-Preferences {
    param(
        [string]$TargetLanguage
    )

    if (-not [string]::IsNullOrWhiteSpace($TargetLanguage)) {
        Stop-LyricsLookupJob
        $script:currentTargetLanguage = $TargetLanguage
        $translationCache = @{}
        $script:lyricsStateByTrackKey = @{}
        $script:cachedTrackKey = ""
        $script:cachedLyrics = $null
        $script:lastLyricsLookupAttempts = @()
        $script:lastLyricsLookupError = ""
    }
}

$listener = [System.Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, $Port)
try {
    $listener.Start()
}
catch {
    throw ("Dual Lyrics could not bind to port {0}. Another Dual Lyrics server may already be running." -f $Port)
}

Write-Host ("Dual Lyrics server running at http://localhost:{0}/" -f $Port)
Write-Host ("Build: {0}" -f $script:serverBuild)
Write-Host ("PID: {0}" -f $PID)
Write-Host "Press Ctrl+C to stop."

if ($OpenBrowser) {
    Start-Sleep -Milliseconds 500
    Start-Process "http://localhost:$Port/"
}

try {
    while ($true) {
        if (-not $listener.Pending()) {
            Start-Sleep -Milliseconds 25
            continue
        }

        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = [IO.StreamReader]::new($stream, [Text.Encoding]::ASCII, $false, 1024, $true)

        try {
            $requestLine = $reader.ReadLine()
            if ([string]::IsNullOrWhiteSpace($requestLine)) {
                $client.Close()
                continue
            }

            while (-not [string]::IsNullOrEmpty($reader.ReadLine())) {
            }

            $parts = $requestLine.Split(" ")
            $method = if ($parts.Count -ge 1) { $parts[0] } else { "" }
            $rawPath = if ($parts.Count -ge 2) { $parts[1] } else { "/" }
            $path = $rawPath.Split("?")[0]

            if ($method -ne "GET") {
                Write-JsonResponse -Stream $stream -Data @{ error = "Method not allowed" } -StatusCode 405 -StatusText "Method Not Allowed"
                continue
            }

            if ($path -eq "/api/state") {
                Write-JsonResponse -Stream $stream -Data (Get-AppState)
                continue
            }

            if ($path -eq "/api/debug") {
                Write-JsonResponse -Stream $stream -Data (Get-DebugState)
                continue
            }

            if ($path -eq "/api/config") {
                Write-JsonResponse -Stream $stream -Data @{
                    targetLanguage = $script:currentTargetLanguage
                    translationProvider = $script:currentTranslationProvider
                    refreshIntervalMs = 1000
                    languageChoices = $script:languageChoices
                    serverBuild = $script:serverBuild
                }
                continue
            }

            if ($path -eq "/api/preferences") {
                $uri = [uri]("http://localhost:$Port" + $rawPath)
                $query = [System.Web.HttpUtility]::ParseQueryString($uri.Query)
                Update-Preferences -TargetLanguage ([string]$query["targetLanguage"])
                Write-JsonResponse -Stream $stream -Data @{
                    ok = $true
                    targetLanguage = $script:currentTargetLanguage
                }
                continue
            }

            if ($path -eq "/api/alignment") {
                $uri = [uri]("http://localhost:$Port" + $rawPath)
                $query = [System.Web.HttpUtility]::ParseQueryString($uri.Query)
                $payload = Get-AlignmentPayload `
                    -OriginalText ([string]$query["originalText"]) `
                    -TranslatedText ([string]$query["translatedText"]) `
                    -SourceLanguage ([string]$query["sourceLanguage"])

                Write-JsonResponse -Stream $stream -Data $payload
                continue
            }

            if ($path -eq "/api/lyrics") {
                $uri = [uri]("http://localhost:$Port" + $rawPath)
                $query = [System.Web.HttpUtility]::ParseQueryString($uri.Query)
                $durationMs = 0
                if (-not [int]::TryParse([string]$query["durationMs"], [ref]$durationMs)) {
                    $durationMs = 0
                }

                $payload = Get-LyricsApiPayload `
                    -TrackKey ([string]$query["trackKey"]) `
                    -Title ([string]$query["title"]) `
                    -Artist ([string]$query["artist"]) `
                    -Album ([string]$query["album"]) `
                    -DurationMs $durationMs

                Write-JsonResponse -Stream $stream -Data $payload
                continue
            }

            if ($path -eq "/") {
                Write-FileResponse -Stream $stream -Path (Join-Path $appRoot "index.html")
                continue
            }

            $relativePath = $path.TrimStart("/").Replace("/", "\")
            $fullPath = Join-Path $appRoot $relativePath
            $resolved = [IO.Path]::GetFullPath($fullPath)
            if (-not $resolved.StartsWith([IO.Path]::GetFullPath($appRoot), [System.StringComparison]::OrdinalIgnoreCase)) {
                Write-JsonResponse -Stream $stream -Data @{ error = "Forbidden" } -StatusCode 403 -StatusText "Forbidden"
                continue
            }

            if (Test-Path -LiteralPath $resolved -PathType Leaf) {
                Write-FileResponse -Stream $stream -Path $resolved
                continue
            }

            Write-JsonResponse -Stream $stream -Data @{ error = "Not found" } -StatusCode 404 -StatusText "Not Found"
        }
        catch {
            if ($stream.CanWrite) {
                Write-JsonResponse -Stream $stream -Data @{ error = $_.Exception.Message } -StatusCode 500 -StatusText "Internal Server Error"
            }
        }
        finally {
            $reader.Dispose()
            $stream.Dispose()
            $client.Close()
        }
    }
}
finally {
    Stop-LyricsLookupJob
    $listener.Stop()
}
