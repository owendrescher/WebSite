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
Import-Module (Join-Path $projectRoot "SpotifyLyrics.Core.psm1") -Force

$appRoot = Join-Path $projectRoot "app"
$translationCache = @{}
$script:cachedTrackKey = ""
$script:cachedLyrics = $null
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
    $Stream.Write($headerBytes, 0, $headerBytes.Length)
    $Stream.Write($BodyBytes, 0, $BodyBytes.Length)
    $Stream.Flush()
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

function Get-AppState {
    $track = Get-SpotifyTrack
    if ($null -eq $track) {
        $script:cachedTrackKey = ""
        $script:cachedLyrics = $null
        return [pscustomobject]@{
            status = "idle"
            timestampIso = (Get-Date).ToString("o")
            settings = @{
                targetLanguage = $script:currentTargetLanguage
                translationProvider = $script:currentTranslationProvider
                languageChoices = $script:languageChoices
            }
            track = $null
            lyrics = @{
                mode = "missing"
                synced = @()
                plain = @()
                sourceLanguage = ""
                translationVisible = $false
            }
        }
    }

    if ($track.TrackKey -ne $script:cachedTrackKey) {
        if ([string]::IsNullOrWhiteSpace($track.Title) -or [string]::IsNullOrWhiteSpace($track.Artist)) {
            $script:cachedLyrics = $null
        }
        else {
            $baseLyrics = Get-TrackLyricsData -Track $track
            $script:cachedLyrics = if ($null -eq $baseLyrics) {
                $null
            }
            else {
                Add-TranslationsToLyrics -LyricsData $baseLyrics -TargetLanguage $script:currentTargetLanguage -TranslationProvider $script:currentTranslationProvider -TranslationCache $translationCache
            }
        }

        $script:cachedTrackKey = $track.TrackKey
    }

    $mode = "missing"
    if ($null -ne $script:cachedLyrics) {
        if ($script:cachedLyrics.Synced.Count -gt 0) {
            $mode = "synced"
        }
        elseif ($script:cachedLyrics.Plain.Count -gt 0) {
            $mode = "plain"
        }
    }

    $syncedPayload = if ($null -ne $script:cachedLyrics) {
        @(
            foreach ($entry in $script:cachedLyrics.Synced) {
                [pscustomobject]@{
                    timestampMs = $entry.TimestampMs
                    text = $entry.Text
                    translation = $entry.Translation
                    phonetic = $entry.Phonetic
                }
            }
        )
    }
    else {
        @()
    }

    $plainPayload = if ($null -ne $script:cachedLyrics) {
        @(
            foreach ($line in $script:cachedLyrics.Plain) {
                [pscustomobject]@{
                    text = $line.Text
                    translation = $line.Translation
                    phonetic = $line.Phonetic
                }
            }
        )
    }
    else {
        @()
    }

    return [pscustomobject]@{
        status = "active"
        timestampIso = (Get-Date).ToString("o")
        settings = @{
            targetLanguage = $script:currentTargetLanguage
            translationProvider = $script:currentTranslationProvider
            languageChoices = $script:languageChoices
        }
        track = [pscustomobject]@{
            trackKey = $track.TrackKey
            sourceApp = $track.SourceApp
            title = $track.Title
            artist = $track.Artist
            album = $track.Album
            playbackStatus = $track.PlaybackStatus
            positionMs = $track.PositionMs
            endTimeMs = $track.EndTimeMs
            lastUpdatedIso = $track.LastUpdatedIso
        }
        lyrics = @{
            mode = $mode
            synced = $syncedPayload
            plain = $plainPayload
            sourceLanguage = if ($null -ne $script:cachedLyrics) { $script:cachedLyrics.SourceLanguage } else { "" }
            translationVisible = if ($null -ne $script:cachedLyrics) {
                ($script:cachedLyrics.SourceLanguage -ne "" -and $script:cachedLyrics.SourceLanguage -ne $script:currentTargetLanguage)
            }
            else {
                $false
            }
        }
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
    }
}

function Get-LyricsApiPayload {
    param(
        [string]$Title,
        [string]$Artist,
        [string]$Album,
        [int]$DurationMs = 0
    )

    if ([string]::IsNullOrWhiteSpace($Title) -or [string]::IsNullOrWhiteSpace($Artist)) {
        return [pscustomobject]@{
            mode = "missing"
            synced = @()
            plain = @()
        }
    }

    $track = [pscustomobject]@{
        Title = $Title
        Artist = $Artist
        Album = $Album
        EndTimeMs = $DurationMs
    }

    $baseLyrics = Get-TrackLyricsData -Track $track
    if ($null -eq $baseLyrics) {
        return [pscustomobject]@{
            mode = "missing"
            synced = @()
            plain = @()
        }
    }

    $translatedLyrics = Add-TranslationsToLyrics -LyricsData $baseLyrics -TargetLanguage $script:currentTargetLanguage -TranslationProvider $script:currentTranslationProvider -TranslationCache $translationCache

    $mode = if ($translatedLyrics.Synced.Count -gt 0) {
        "synced"
    }
    elseif ($translatedLyrics.Plain.Count -gt 0) {
        "plain"
    }
    else {
        "missing"
    }

    $synced = @(
        foreach ($entry in $translatedLyrics.Synced) {
            [pscustomobject]@{
                timestampMs = $entry.TimestampMs
                text = $entry.Text
                translation = $entry.Translation
                phonetic = $entry.Phonetic
            }
        }
    )

    $plain = @(
        foreach ($line in $translatedLyrics.Plain) {
            [pscustomobject]@{
                text = $line.Text
                translation = $line.Translation
                phonetic = $line.Phonetic
            }
        }
    )

    return [pscustomobject]@{
        mode = $mode
        synced = $synced
        plain = $plain
        sourceLanguage = $translatedLyrics.SourceLanguage
        translationVisible = ($translatedLyrics.SourceLanguage -ne "" -and $translatedLyrics.SourceLanguage -ne $script:currentTargetLanguage)
    }
}

function Update-Preferences {
    param(
        [string]$TargetLanguage
    )

    if (-not [string]::IsNullOrWhiteSpace($TargetLanguage)) {
        $script:currentTargetLanguage = $TargetLanguage
        $translationCache = @{}
        $script:cachedTrackKey = ""
        $script:cachedLyrics = $null
    }
}

$listener = [System.Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, $Port)
$listener.Start()

Write-Host ("Dual Lyrics server running at http://localhost:{0}/" -f $Port)
Write-Host "Press Ctrl+C to stop."

if ($OpenBrowser) {
    Start-Sleep -Milliseconds 500
    Start-Process "http://localhost:$Port/"
}

try {
    while ($true) {
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
                    refreshIntervalMs = 5000
                    languageChoices = $script:languageChoices
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

            if ($path -eq "/api/lyrics") {
                $uri = [uri]("http://localhost:$Port" + $rawPath)
                $query = [System.Web.HttpUtility]::ParseQueryString($uri.Query)
                $durationMs = 0
                if (-not [int]::TryParse([string]$query["durationMs"], [ref]$durationMs)) {
                    $durationMs = 0
                }

                $payload = Get-LyricsApiPayload `
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
