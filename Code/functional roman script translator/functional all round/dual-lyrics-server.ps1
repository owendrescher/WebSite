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
$script:lyricsCacheByTrackKey = @{}
$script:lastLyricsLookupAttempts = @()
$script:lastLyricsLookupError = ""
$script:cachedArtworkTrackKey = ""
$script:cachedArtworkUrl = ""
$script:currentTargetLanguage = $TargetLanguage
$script:currentTranslationProvider = $TranslationProvider
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
                    timestampMs = $entry.TimestampMs
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

function Get-AppState {
    $track = Get-SpotifyTrack
    if ($null -eq $track) {
        $script:cachedTrackKey = ""
        $script:cachedLyrics = $null
        $script:lyricsCacheByTrackKey = @{}
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
            $fallbackArt = Get-AlbumArtFallbackUrl -Artist $track.Artist -Album $track.Album -Title $track.Title
            if (-not [string]::IsNullOrWhiteSpace($fallbackArt)) {
                $track | Add-Member -NotePropertyName ArtworkUrl -NotePropertyValue $fallbackArt -Force
            }
        }

        $script:cachedArtworkTrackKey = $track.TrackKey
        $script:cachedArtworkUrl = [string]$track.ArtworkUrl

        $script:lastLyricsLookupAttempts = @()
        $script:lastLyricsLookupError = ""
        $script:cachedLyrics = if ($script:lyricsCacheByTrackKey.ContainsKey($track.TrackKey)) {
            $script:lyricsCacheByTrackKey[$track.TrackKey]
        }
        else {
            $null
        }

        $script:cachedTrackKey = $track.TrackKey
    }
    $lyricsFallbackMode = if ($null -ne $script:cachedLyrics) {
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

    if (-not [string]::IsNullOrWhiteSpace($TrackKey) -and $script:lyricsCacheByTrackKey.ContainsKey($TrackKey)) {
        return Convert-DisplayLyricsToApiPayload -LyricsData $script:lyricsCacheByTrackKey[$TrackKey] -FallbackMode "missing"
    }

    if ([string]::IsNullOrWhiteSpace($Title) -or [string]::IsNullOrWhiteSpace($Artist)) {
        return Convert-DisplayLyricsToApiPayload -LyricsData $null -FallbackMode "missing"
    }

    $track = [pscustomobject]@{
        Title = $Title
        Artist = $Artist
        Album = $Album
        EndTimeMs = $DurationMs
    }

    $baseLyrics = Get-TrackLyricsData -Track $track
    $script:lastLyricsLookupAttempts = @(Get-LastLyricsLookupAttempts)
    $script:lastLyricsLookupError = Get-LastLyricsLookupError
    if ($null -eq $baseLyrics) {
        return Convert-DisplayLyricsToApiPayload -LyricsData $null -FallbackMode "missing" -LookupAttempts $script:lastLyricsLookupAttempts -LookupError $script:lastLyricsLookupError
    }

    try {
        $translatedLyrics = Add-TranslationsToLyrics -LyricsData $baseLyrics -TargetLanguage $script:currentTargetLanguage -TranslationProvider $script:currentTranslationProvider -TranslationCache $translationCache
    }
    catch {
        $translatedLyrics = Convert-LyricsDataToDisplayData -LyricsData $baseLyrics
    }

    if (-not [string]::IsNullOrWhiteSpace($TrackKey)) {
        $script:lyricsCacheByTrackKey[$TrackKey] = $translatedLyrics
        if ($TrackKey -eq $script:cachedTrackKey) {
            $script:cachedLyrics = $translatedLyrics
        }
    }

    return Convert-DisplayLyricsToApiPayload -LyricsData $translatedLyrics -FallbackMode "missing" -LookupAttempts $script:lastLyricsLookupAttempts -LookupError $script:lastLyricsLookupError
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
        $script:currentTargetLanguage = $TargetLanguage
        $translationCache = @{}
        $script:lyricsCacheByTrackKey = @{}
        $script:cachedTrackKey = ""
        $script:cachedLyrics = $null
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
                    refreshIntervalMs = 500
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
    $listener.Stop()
}
