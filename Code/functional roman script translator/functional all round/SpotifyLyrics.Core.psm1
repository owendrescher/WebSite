Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$script:TitleNoisePatterns = @(
    '\s*-\s*(single version|album version|radio edit|edit|remaster(ed)?(\s+\d{4})?|mono|stereo|live|acoustic|demo|version)\s*$',
    '\s*\((single version|album version|radio edit|edit|remaster(ed)?(\s+\d{4})?|mono|stereo|live|acoustic|demo|version)\)\s*$',
    '\s*\[(single version|album version|radio edit|edit|remaster(ed)?(\s+\d{4})?|mono|stereo|live|acoustic|demo|version)\]\s*$',
    '\s+\bfeat\.?.*$',
    '\s+\bft\.?.*$'
)

$script:PhoneticLanguagePrefixes = @("zh", "ja", "ko", "ru", "uk", "bg", "sr", "mk", "be", "el", "ar")
$script:LastLyricsLookupAttempts = @()
$script:LastLyricsLookupError = ""
$script:EnglishFunctionWords = @(
    "a", "an", "the", "to", "of", "in", "on", "at", "for", "from", "with", "by",
    "and", "or", "but", "if", "then", "than", "that", "this", "these", "those",
    "i", "you", "we", "they", "he", "she", "it", "me", "him", "her", "us", "them",
    "am", "is", "are", "was", "were", "be", "been", "being", "do", "does", "did",
    "what", "who", "how", "when", "where", "why", "not"
)

function Invoke-Utf8Request {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Uri,

        [ValidateSet("GET", "POST")]
        [string]$Method = "GET",

        [hashtable]$Headers,
        [string]$Body,
        [string]$ContentType = "application/json",
        [int]$TimeoutSec = 20
    )

    $params = @{
        Uri = $Uri
        Method = $Method
        TimeoutSec = $TimeoutSec
        ErrorAction = "Stop"
        UseBasicParsing = $true
    }

    if ($Headers) {
        $params.Headers = $Headers
    }

    if ($Method -eq "POST") {
        $params.Body = $Body
        $params.ContentType = $ContentType
    }

    $response = Invoke-WebRequest @params
    $stream = $response.RawContentStream
    if ($null -eq $stream) {
        return $response.Content
    }

    $stream.Position = 0
    $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::UTF8, $true)
    try {
        return $reader.ReadToEnd()
    }
    finally {
        $reader.Dispose()
    }
}

function Invoke-Utf8JsonRequest {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Uri,

        [ValidateSet("GET", "POST")]
        [string]$Method = "GET",

        [hashtable]$Headers,
        [string]$Body,
        [string]$ContentType = "application/json",
        [int]$TimeoutSec = 20
    )

    $text = Invoke-Utf8Request -Uri $Uri -Method $Method -Headers $Headers -Body $Body -ContentType $ContentType -TimeoutSec $TimeoutSec
    if ([string]::IsNullOrWhiteSpace($text)) {
        return $null
    }

    return $text | ConvertFrom-Json
}

function Await-WinRtOperation {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Operation,

        [Parameter(Mandatory = $true)]
        [Type]$ResultType
    )

    Add-Type -AssemblyName System.Runtime.WindowsRuntime
    $asTask = [System.WindowsRuntimeSystemExtensions].GetMethods() |
        Where-Object {
            $_.ToString() -eq 'System.Threading.Tasks.Task`1[TResult] AsTask[TResult](Windows.Foundation.IAsyncOperation`1[TResult])'
        } |
        Select-Object -First 1

    if ($null -eq $asTask) {
        throw "Could not locate Windows Runtime AsTask helper."
    }

    $generic = $asTask.MakeGenericMethod($ResultType)
    return $generic.Invoke($null, @($Operation)).Result
}

function Repair-Mojibake {
    param(
        [string]$Text
    )

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return $Text
    }

    $markerA = [char]0x00C3
    $markerB = [char]0x00C2
    $markerC = [char]0x00E2
    if (($Text.IndexOf($markerA) -lt 0) -and ($Text.IndexOf($markerB) -lt 0) -and ($Text.IndexOf($markerC) -lt 0)) {
        return $Text
    }

    $candidates = New-Object System.Collections.Generic.List[string]
    $candidates.Add($Text)

    foreach ($encodingName in @("iso-8859-1", "Windows-1252")) {
        try {
            $bytes = [System.Text.Encoding]::GetEncoding($encodingName).GetBytes($Text)
            $decoded = [System.Text.Encoding]::UTF8.GetString($bytes)
            if (-not [string]::IsNullOrWhiteSpace($decoded)) {
                $candidates.Add($decoded)
            }
        }
        catch {
        }
    }

    $best = $Text
    $bestScore = -999
    foreach ($candidate in ($candidates | Select-Object -Unique)) {
        $score = 0
        if ($candidate -match '\p{IsCJKUnifiedIdeographs}') { $score += 12 }
        if ($candidate -match '\p{IsCyrillic}') { $score += 10 }
        if ($candidate -match '\p{L}') { $score += 6 }
        if (($candidate.IndexOf($markerA) -lt 0) -and ($candidate.IndexOf($markerB) -lt 0) -and ($candidate.IndexOf($markerC) -lt 0)) { $score += 8 }
        if ($candidate -match ([regex]::Escape([string][char]0xFFFD))) { $score -= 12 }
        if ($candidate.Length -lt [math]::Max(1, [int]($Text.Length * 0.5))) { $score -= 4 }
        if ($score -gt $bestScore) {
            $best = $candidate
            $bestScore = $score
        }
    }

    return $best
}

function Get-SourceLanguageHint {
    param(
        [string]$Text
    )

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return ""
    }

    if ($Text -match '\p{IsHiragana}|\p{IsKatakana}') { return "ja" }
    if ($Text -match '\p{IsHangulSyllables}|\p{IsHangulJamo}') { return "ko" }
    if ($Text -match '\p{IsCJKUnifiedIdeographs}') { return "zh" }
    if ($Text -match '\p{IsCyrillic}') { return "ru" }
    if ($Text -match '\p{IsGreek}') { return "el" }
    if ($Text -match '\p{IsArabic}') { return "ar" }

    return ""
}

function Normalize-LyricText {
    param(
        [string]$Text
    )

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return ""
    }

    $value = (Repair-Mojibake -Text $Text).ToLowerInvariant()
    $value = [regex]::Replace($value, '[^\p{L}\p{Nd}\s]', ' ')
    $value = [regex]::Replace($value, '\s+', ' ').Trim()
    return $value
}

function Remove-Diacritics {
    param(
        [string]$Text
    )

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return ""
    }

    try {
        $normalized = [string]$Text
        $normalized = $normalized.Normalize([System.Text.NormalizationForm]::FormD)
        $stripped = [regex]::Replace($normalized, '\p{Mn}+', '')
        return ([string]$stripped).Normalize([System.Text.NormalizationForm]::FormC)
    }
    catch {
        return [string]$Text
    }
}

function Split-LyricTokens {
    param(
        [string]$Text
    )

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return @()
    }

    $trimmed = $Text.Trim()
    if ([string]::IsNullOrWhiteSpace($trimmed)) {
        return @()
    }

    $scriptLike = [regex]::IsMatch($trimmed, '[\p{IsCJKUnifiedIdeographs}\p{IsHiragana}\p{IsKatakana}\p{IsHangulSyllables}\p{IsArabic}\p{IsCyrillic}]')
    if ($scriptLike -and -not ($trimmed -match '\s')) {
        return @($trimmed.ToCharArray() | ForEach-Object { [string]$_ } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
    }

    return @($trimmed -split '\s+' | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
}

function Get-ThumbnailDataUri {
    param(
        [object]$ThumbnailReference
    )

    if ($null -eq $ThumbnailReference) {
        return ""
    }

    try {
        $streamType = [Windows.Storage.Streams.IRandomAccessStreamWithContentType, Windows.Storage.Streams, ContentType = WindowsRuntime]
        $readerType = [Windows.Storage.Streams.DataReader, Windows.Storage.Streams, ContentType = WindowsRuntime]
        $stream = Await-WinRtOperation -Operation $ThumbnailReference.OpenReadAsync() -ResultType $streamType
        if ($null -eq $stream -or $stream.Size -le 0) {
            return ""
        }

        $size = [uint32]$stream.Size
        $reader = $readerType::new($stream)
        [void](Await-WinRtOperation -Operation $reader.LoadAsync($size) -ResultType ([uint32]))
        $bytes = New-Object byte[] $size
        $reader.ReadBytes($bytes)
        $contentType = [string]$stream.ContentType
        if ([string]::IsNullOrWhiteSpace($contentType)) {
            $contentType = "image/jpeg"
        }

        $reader.Dispose()
        $stream.Dispose()
        return "data:{0};base64,{1}" -f $contentType, [Convert]::ToBase64String($bytes)
    }
    catch {
        return ""
    }
}

function Get-AlbumArtFallbackUrl {
    param(
        [string]$Artist,
        [string]$Album,
        [string]$Title
    )

    $queryParts = @($Artist, $Album, $Title) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
    if ($queryParts.Count -eq 0) {
        return ""
    }

    $uri = "https://itunes.apple.com/search?term={0}&entity=song&limit=1" -f [uri]::EscapeDataString(($queryParts -join " "))
    try {
        $response = Invoke-Utf8JsonRequest -Uri $uri -Method "GET" -TimeoutSec 15
        $item = @($response.results)[0]
        if ($null -eq $item) {
            return ""
        }

        $art = [string]$item.artworkUrl100
        if ([string]::IsNullOrWhiteSpace($art)) {
            return ""
        }

        return ($art -replace '100x100bb', '600x600bb')
    }
    catch {
        return ""
    }
}

function Get-SpotifySession {
    try {
        $null = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager, Windows.Media.Control, ContentType = WindowsRuntime]
        $managerOp = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager]::RequestAsync()
        $manager = Await-WinRtOperation -Operation $managerOp -ResultType ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager])
    }
    catch {
        return $null
    }

    if ($null -eq $manager) {
        return $null
    }

    foreach ($session in $manager.GetSessions()) {
        if ($session.SourceAppUserModelId -match "Spotify") {
            return $session
        }
    }

    return $null
}

function Get-SpotifyTrack {
    try {
        $session = Get-SpotifySession
        if ($null -ne $session) {
            $info = $session.GetPlaybackInfo()
            $timeline = $session.GetTimelineProperties()
            $propsOp = $session.TryGetMediaPropertiesAsync()
            $props = Await-WinRtOperation -Operation $propsOp -ResultType ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties])

            return [pscustomobject]@{
                SourceApp = $session.SourceAppUserModelId
                Title = Repair-Mojibake -Text ([string]$props.Title)
                Artist = Repair-Mojibake -Text ([string]$props.Artist)
                Album = Repair-Mojibake -Text ([string]$props.AlbumTitle)
                ArtworkUrl = Get-ThumbnailDataUri -ThumbnailReference $props.Thumbnail
                TrackNumber = $props.TrackNumber
                PlaybackType = [string]$info.PlaybackType
                PlaybackStatus = [string]$info.PlaybackStatus
                PositionMs = [math]::Max(0, [int]$timeline.Position.TotalMilliseconds)
                EndTimeMs = [math]::Max(0, [int]$timeline.EndTime.TotalMilliseconds)
                LastUpdatedIso = (Get-Date).ToString("o")
                TrackKey = "{0}|{1}|{2}" -f [string]$props.Artist, [string]$props.Title, [string]$props.AlbumTitle
            }
        }
    }
    catch {
    }

    $automationTrack = Get-SpotifyTrackFromAutomation
    if ($null -ne $automationTrack) {
        return $automationTrack
    }

    return Get-SpotifyTrackFromProcess
}

function Get-SpotifyTrackFromAutomation {
    try {
        Add-Type -AssemblyName UIAutomationClient
        Add-Type -AssemblyName UIAutomationTypes
    }
    catch {
        return $null
    }

    $spotifyIds = @(Get-Process Spotify -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Id)
    if ($spotifyIds.Count -eq 0) {
        return $null
    }

    try {
        $root = [System.Windows.Automation.AutomationElement]::RootElement
    }
    catch {
        return $null
    }

    foreach ($pid in $spotifyIds) {
        try {
            $condition = New-Object System.Windows.Automation.PropertyCondition(
                [System.Windows.Automation.AutomationElement]::ProcessIdProperty,
                $pid
            )
            $elements = $root.FindAll([System.Windows.Automation.TreeScope]::Descendants, $condition)
        }
        catch {
            continue
        }

        for ($i = 0; $i -lt $elements.Count; $i++) {
            $name = Repair-Mojibake -Text ([string]$elements.Item($i).Current.Name)
            if ([string]::IsNullOrWhiteSpace($name)) {
                continue
            }

            if ($name -match '^(?<artist>.+?)\s+[\u2013-]\s+(?<song>.+)$') {
                $artist = $matches.artist.Trim()
                $song = $matches.song.Trim()
                if ($artist -and $song -and $song -notmatch '^Spotify') {
                    return [pscustomobject]@{
                        SourceApp = "SpotifyAutomation"
                        Title = $song
                        Artist = $artist
                        Album = ""
                        ArtworkUrl = ""
                        TrackNumber = 0
                        PlaybackType = "Music"
                        PlaybackStatus = "Playing"
                        PositionMs = 0
                        EndTimeMs = 0
                        LastUpdatedIso = (Get-Date).ToString("o")
                        TrackKey = "{0}|{1}|" -f $artist, $song
                    }
                }
            }
        }
    }

    return $null
}

function Get-SpotifyTrackFromProcess {
    $spotifyProcesses = @(Get-Process Spotify -ErrorAction SilentlyContinue)
    if ($spotifyProcesses.Count -eq 0) {
        return $null
    }

    $bestWindow = $spotifyProcesses |
        Where-Object { -not [string]::IsNullOrWhiteSpace($_.MainWindowTitle) } |
        Select-Object -First 1

    if ($null -eq $bestWindow) {
        return [pscustomobject]@{
            SourceApp = "SpotifyProcess"
            Title = ""
            Artist = ""
            Album = ""
            ArtworkUrl = ""
            TrackNumber = 0
            PlaybackType = "Unknown"
            PlaybackStatus = "Running"
            PositionMs = 0
            EndTimeMs = 0
            LastUpdatedIso = (Get-Date).ToString("o")
            TrackKey = "spotify-running-without-window-title"
        }
    }

    $title = Repair-Mojibake -Text ([string]$bestWindow.MainWindowTitle)
    if ($title -match '^(?<artist>.+?)\s+[\u2013-]\s+(?<song>.+)$') {
        return [pscustomobject]@{
            SourceApp = "SpotifyProcessWindow"
            Title = $matches.song.Trim()
            Artist = $matches.artist.Trim()
            Album = ""
            ArtworkUrl = ""
            TrackNumber = 0
            PlaybackType = "Music"
            PlaybackStatus = "Playing"
            PositionMs = 0
            EndTimeMs = 0
            LastUpdatedIso = (Get-Date).ToString("o")
            TrackKey = "{0}|{1}|" -f $matches.artist.Trim(), $matches.song.Trim()
        }
    }

    return [pscustomobject]@{
        SourceApp = "SpotifyProcessWindow"
        Title = $title.Trim()
        Artist = ""
        Album = ""
        ArtworkUrl = ""
        TrackNumber = 0
        PlaybackType = "Unknown"
        PlaybackStatus = "Running"
        PositionMs = 0
        EndTimeMs = 0
        LastUpdatedIso = (Get-Date).ToString("o")
        TrackKey = "spotify-window-title|" + $title.Trim()
    }
}

function Get-TitleVariants {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Title
    )

    $variants = New-Object System.Collections.Generic.List[string]
    $base = Repair-Mojibake -Text $Title
    if (-not [string]::IsNullOrWhiteSpace($base)) {
        $variants.Add($base.Trim())
    }

    $current = $base
    foreach ($pattern in $script:TitleNoisePatterns) {
        $current = [regex]::Replace($current, $pattern, "", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Trim()
    }

    if (-not [string]::IsNullOrWhiteSpace($current)) {
        $variants.Add($current)
    }

    $parenStripped = [regex]::Replace($current, '\s*[\(\[].*?[\)\]]', "").Trim()
    if (-not [string]::IsNullOrWhiteSpace($parenStripped)) {
        $variants.Add($parenStripped)
    }

    $asciiVariant = (Remove-Diacritics -Text $base).Trim()
    if (-not [string]::IsNullOrWhiteSpace($asciiVariant)) {
        $variants.Add($asciiVariant)
    }

    $asciiParenStripped = (Remove-Diacritics -Text $parenStripped).Trim()
    if (-not [string]::IsNullOrWhiteSpace($asciiParenStripped)) {
        $variants.Add($asciiParenStripped)
    }

    return @($variants | Select-Object -Unique)
}

function Get-ArtistVariants {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Artist
    )

    $variants = New-Object System.Collections.Generic.List[string]
    $fixed = (Repair-Mojibake -Text $Artist).Trim()
    if (-not [string]::IsNullOrWhiteSpace($fixed)) {
        $variants.Add($fixed)
    }

    $asciiVariant = (Remove-Diacritics -Text $fixed).Trim()
    if (-not [string]::IsNullOrWhiteSpace($asciiVariant)) {
        $variants.Add($asciiVariant)
    }

    return @($variants | Select-Object -Unique)
}

function Invoke-LrcLibGet {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Title,

        [Parameter(Mandatory = $true)]
        [string]$Artist,

        [string]$Album,
        [int]$DurationSeconds
    )

    $query = @{
        track_name = $Title
        artist_name = $Artist
    }

    if (-not [string]::IsNullOrWhiteSpace($Album)) {
        $query.album_name = $Album
    }

    if ($DurationSeconds -gt 0) {
        $query.duration = $DurationSeconds
    }

    $pairs = foreach ($key in $query.Keys) {
        "{0}={1}" -f [uri]::EscapeDataString($key), [uri]::EscapeDataString([string]$query[$key])
    }

    $uri = "https://lrclib.net/api/get?{0}" -f ($pairs -join "&")

    try {
        return Invoke-Utf8JsonRequest -Uri $uri -Method "GET" -Headers @{ Accept = "application/json" } -TimeoutSec 15
    }
    catch {
        return $null
    }
}

function Search-LrcLibLyrics {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Title,

        [string]$Artist,

        [int]$DurationSeconds
    )

    $query = @{
        track_name = $Title
    }

    if (-not [string]::IsNullOrWhiteSpace($Artist)) {
        $query.artist_name = $Artist
    }

    $pairs = foreach ($key in $query.Keys) {
        "{0}={1}" -f [uri]::EscapeDataString($key), [uri]::EscapeDataString([string]$query[$key])
    }

    $uri = "https://lrclib.net/api/search?{0}" -f ($pairs -join "&")

    try {
        $results = @(Invoke-Utf8JsonRequest -Uri $uri -Method "GET" -Headers @{ Accept = "application/json" } -TimeoutSec 15)
    }
    catch {
        return $null
    }

    if ($results.Count -eq 0) {
        return $null
    }

    $normalizedArtist = Normalize-LyricText -Text $Artist
    $normalizedTitle = Normalize-LyricText -Text $Title
    $ranked = $results |
        ForEach-Object {
            $item = $_
            $score = 0

            if (-not [string]::IsNullOrWhiteSpace($normalizedArtist)) {
                if ((Normalize-LyricText -Text ([string]$item.artistName)) -eq $normalizedArtist) { $score += 20 }
            }

            $itemTitle = Normalize-LyricText -Text ([string]$item.trackName)
            if ($itemTitle -eq $normalizedTitle) { $score += 20 }
            elseif ($itemTitle -like "*$normalizedTitle*" -or $normalizedTitle -like "*$itemTitle*") { $score += 10 }

            if ($DurationSeconds -gt 0 -and $item.duration) {
                $delta = [math]::Abs([int]$item.duration - $DurationSeconds)
                if ($delta -le 2) { $score += 10 }
                elseif ($delta -le 8) { $score += 5 }
            }

            [pscustomobject]@{
                Score = $score
                Item = $item
            }
        } |
        Sort-Object Score -Descending

    if ($ranked.Count -eq 0 -or $ranked[0].Score -lt 10) {
        return $null
    }

    return $ranked[0].Item
}

function Get-LyricsOvhLyrics {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Title,

        [Parameter(Mandatory = $true)]
        [string]$Artist
    )

    $uri = "https://api.lyrics.ovh/v1/{0}/{1}" -f [uri]::EscapeDataString($Artist), [uri]::EscapeDataString($Title)

    try {
        $response = Invoke-Utf8JsonRequest -Uri $uri -Method "GET" -Headers @{ Accept = "application/json" } -TimeoutSec 15
    }
    catch {
        return $null
    }

    if ([string]::IsNullOrWhiteSpace([string]$response.lyrics)) {
        return $null
    }

    return [pscustomobject]@{
        plainLyrics = Repair-Mojibake -Text ([string]$response.lyrics)
        syncedLyrics = ""
        provider = "lyrics.ovh"
    }
}

function Convert-LyricsValueToText {
    param(
        [object]$Value
    )

    if ($null -eq $Value) {
        return ""
    }

    if ($Value -is [string]) {
        return [string]$Value
    }

    if ($Value -is [System.Collections.IEnumerable]) {
        $items = @()
        foreach ($item in $Value) {
            if ($null -ne $item) {
                $items += [string]$item
            }
        }

        return ($items -join "`n")
    }

    return [string]$Value
}

function Test-LyricsPayloadHasContent {
    param(
        [object]$LyricsPayload
    )

    if ($null -eq $LyricsPayload) {
        return $false
    }

    $plain = Convert-LyricsValueToText -Value $LyricsPayload.plainLyrics
    $synced = Convert-LyricsValueToText -Value $LyricsPayload.syncedLyrics
    return (-not [string]::IsNullOrWhiteSpace($plain)) -or (-not [string]::IsNullOrWhiteSpace($synced))
}

function Get-LastLyricsLookupAttempts {
    return @($script:LastLyricsLookupAttempts)
}

function Get-LastLyricsLookupError {
    return [string]$script:LastLyricsLookupError
}

function Find-ShazamSongUrl {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Title,

        [Parameter(Mandatory = $true)]
        [string]$Artist
    )

    $query = ('site:shazam.com/song "{0}" "{1}"' -f $Title, $Artist)
    $uri = "https://html.duckduckgo.com/html/?q={0}" -f [uri]::EscapeDataString($query)

    try {
        $html = Invoke-Utf8Request -Uri $uri -Method "GET" -TimeoutSec 15
    }
    catch {
        return ""
    }

    if ([string]::IsNullOrWhiteSpace($html)) {
        return ""
    }

    $match = [regex]::Match($html, 'uddg=(https%3A%2F%2Fwww\.shazam\.com%2Fsong%2F[^"&]+)')
    if ($match.Success) {
        return [uri]::UnescapeDataString($match.Groups[1].Value)
    }

    $directMatch = [regex]::Match($html, 'https://www\.shazam\.com/song/[^"\s<]+')
    if ($directMatch.Success) {
        return $directMatch.Value
    }

    return ""
}

function Get-ShazamLyrics {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Title,

        [Parameter(Mandatory = $true)]
        [string]$Artist
    )

    $songUrl = Find-ShazamSongUrl -Title $Title -Artist $Artist
    if ([string]::IsNullOrWhiteSpace($songUrl)) {
        return $null
    }

    try {
        $html = Invoke-Utf8Request -Uri $songUrl -Method "GET" -TimeoutSec 15
    }
    catch {
        return $null
    }

    if ([string]::IsNullOrWhiteSpace($html)) {
        return $null
    }

    $start = $html.IndexOf("## Lyrics")
    if ($start -lt 0) {
        return $null
    }

    $end = $html.IndexOf("Written by:", $start)
    if ($end -lt 0) {
        $end = $html.IndexOf("## Shazam Footer", $start)
    }
    if ($end -lt 0) {
        $end = $html.Length
    }

    $block = $html.Substring($start, $end - $start)
    $lines = @(
        $block -split "`r?`n" |
            ForEach-Object { (Repair-Mojibake -Text $_).Trim() } |
            Where-Object {
                -not [string]::IsNullOrWhiteSpace($_) -and
                $_ -ne "## Lyrics" -and
                $_ -notmatch '^(Verse|Chorus|Bridge|Intro|Outro|Refrain|Pre-Chorus|Hook)(\s+\d+)?$'
            }
    )

    if ($lines.Count -eq 0) {
        return $null
    }

    return [pscustomobject]@{
        plainLyrics = ($lines -join "`n")
        syncedLyrics = ""
        provider = "shazam"
    }
}

function Find-GeniusSongUrl {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Title,

        [Parameter(Mandatory = $true)]
        [string]$Artist
    )

    $query = ('site:genius.com "{0}" "{1}" lyrics' -f $Title, $Artist)
    $uri = "https://html.duckduckgo.com/html/?q={0}" -f [uri]::EscapeDataString($query)

    try {
        $html = Invoke-Utf8Request -Uri $uri -Method "GET" -TimeoutSec 15
    }
    catch {
        return ""
    }

    if ([string]::IsNullOrWhiteSpace($html)) {
        return ""
    }

    $match = [regex]::Match($html, 'uddg=(https%3A%2F%2Fgenius\.com%2F[^"&]+)')
    if ($match.Success) {
        return [uri]::UnescapeDataString($match.Groups[1].Value)
    }

    $directMatch = [regex]::Match($html, 'https://genius\.com/[^"\s<]+')
    if ($directMatch.Success) {
        return $directMatch.Value
    }

    return ""
}

function Get-GeniusLyrics {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Title,

        [Parameter(Mandatory = $true)]
        [string]$Artist
    )

    $songUrl = Find-GeniusSongUrl -Title $Title -Artist $Artist
    if ([string]::IsNullOrWhiteSpace($songUrl)) {
        return $null
    }

    try {
        $html = Invoke-Utf8Request -Uri $songUrl -Method "GET" -TimeoutSec 15
    }
    catch {
        return $null
    }

    if ([string]::IsNullOrWhiteSpace($html)) {
        return $null
    }

    $matches = [regex]::Matches($html, '(?s)<div[^>]+data-lyrics-container="true"[^>]*>(.*?)</div>')
    if ($matches.Count -eq 0) {
        return $null
    }

    $lines = New-Object System.Collections.Generic.List[string]
    foreach ($match in $matches) {
        $chunk = [string]$match.Groups[1].Value
        $chunk = [regex]::Replace($chunk, '<br\s*/?>', "`n")
        $chunk = [regex]::Replace($chunk, '<.*?>', '')
        foreach ($line in ($chunk -split "`r?`n")) {
            $fixed = (Repair-Mojibake -Text $line).Trim()
            if (-not [string]::IsNullOrWhiteSpace($fixed) -and $fixed -notmatch '^\[.*\]$') {
                $lines.Add($fixed)
            }
        }
    }

    if ($lines.Count -eq 0) {
        return $null
    }

    return [pscustomobject]@{
        plainLyrics = (($lines | Select-Object -Unique) -join "`n")
        syncedLyrics = ""
        provider = "genius"
    }
}

function Get-LrcLibLyrics {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Title,

        [Parameter(Mandatory = $true)]
        [string]$Artist,

        [string]$Album,
        [int]$DurationSeconds
    )

    $script:LastLyricsLookupAttempts = @()
    $script:LastLyricsLookupError = ""
    $titleVariants = Get-TitleVariants -Title $Title
    $artistVariants = Get-ArtistVariants -Artist $Artist
    $attempts = New-Object System.Collections.Generic.List[object]
    try {
        foreach ($artistVariant in $artistVariants) {
            foreach ($titleVariant in $titleVariants) {
                $exact = Invoke-LrcLibGet -Title $titleVariant -Artist $artistVariant -Album $Album -DurationSeconds $DurationSeconds
                $exactParsed = Convert-LyricsPayloadToTrackData -LyricsPayload $exact
                $exactUsable = Test-DisplayableLyricsData -LyricsData $exactParsed
                $attempts.Add([pscustomobject]@{
                    source = "lrclib_exact_album"
                    title = $titleVariant
                    artist = $artistVariant
                    album = $Album
                    hit = $exactUsable
                    matched = ($null -ne $exact)
                })
                if ($exactUsable) {
                    $script:LastLyricsLookupAttempts = @($attempts.ToArray())
                    return $exact
                }

                if (-not [string]::IsNullOrWhiteSpace($Album)) {
                    $withoutAlbum = Invoke-LrcLibGet -Title $titleVariant -Artist $artistVariant -DurationSeconds $DurationSeconds
                    $withoutAlbumParsed = Convert-LyricsPayloadToTrackData -LyricsPayload $withoutAlbum
                    $withoutAlbumUsable = Test-DisplayableLyricsData -LyricsData $withoutAlbumParsed
                    $attempts.Add([pscustomobject]@{
                        source = "lrclib_exact_basic"
                        title = $titleVariant
                        artist = $artistVariant
                        album = ""
                        hit = $withoutAlbumUsable
                        matched = ($null -ne $withoutAlbum)
                    })
                    if ($withoutAlbumUsable) {
                        $script:LastLyricsLookupAttempts = @($attempts.ToArray())
                        return $withoutAlbum
                    }
                }
            }
        }

        foreach ($artistVariant in $artistVariants) {
            foreach ($titleVariant in $titleVariants) {
                $searched = Search-LrcLibLyrics -Title $titleVariant -Artist $artistVariant -DurationSeconds $DurationSeconds
                $searchedParsed = Convert-LyricsPayloadToTrackData -LyricsPayload $searched
                $searchedUsable = Test-DisplayableLyricsData -LyricsData $searchedParsed
                $attempts.Add([pscustomobject]@{
                    source = "lrclib_search"
                    title = $titleVariant
                    artist = $artistVariant
                    album = ""
                    hit = $searchedUsable
                    matched = ($null -ne $searched)
                })
                if ($searchedUsable) {
                    $script:LastLyricsLookupAttempts = @($attempts.ToArray())
                    return $searched
                }
            }
        }

        foreach ($artistVariant in $artistVariants) {
            foreach ($titleVariant in $titleVariants) {
                $plainFallback = Get-LyricsOvhLyrics -Title $titleVariant -Artist $artistVariant
                $plainFallbackParsed = Convert-LyricsPayloadToTrackData -LyricsPayload $plainFallback
                $plainFallbackUsable = Test-DisplayableLyricsData -LyricsData $plainFallbackParsed
                $attempts.Add([pscustomobject]@{
                    source = "lyrics_ovh"
                    title = $titleVariant
                    artist = $artistVariant
                    album = ""
                    hit = $plainFallbackUsable
                    matched = ($null -ne $plainFallback)
                })
                if ($plainFallbackUsable) {
                    $script:LastLyricsLookupAttempts = @($attempts.ToArray())
                    return $plainFallback
                }
            }
        }

        foreach ($artistVariant in $artistVariants) {
            foreach ($titleVariant in $titleVariants) {
                $shazamFallback = Get-ShazamLyrics -Title $titleVariant -Artist $artistVariant
                $shazamParsed = Convert-LyricsPayloadToTrackData -LyricsPayload $shazamFallback
                $shazamUsable = Test-DisplayableLyricsData -LyricsData $shazamParsed
                $attempts.Add([pscustomobject]@{
                    source = "shazam"
                    title = $titleVariant
                    artist = $artistVariant
                    album = ""
                    hit = $shazamUsable
                    matched = ($null -ne $shazamFallback)
                })
                if ($shazamUsable) {
                    $script:LastLyricsLookupAttempts = @($attempts.ToArray())
                    return $shazamFallback
                }
            }
        }

        foreach ($artistVariant in $artistVariants) {
            foreach ($titleVariant in $titleVariants) {
                $geniusFallback = Get-GeniusLyrics -Title $titleVariant -Artist $artistVariant
                $geniusParsed = Convert-LyricsPayloadToTrackData -LyricsPayload $geniusFallback
                $geniusUsable = Test-DisplayableLyricsData -LyricsData $geniusParsed
                $attempts.Add([pscustomobject]@{
                    source = "genius"
                    title = $titleVariant
                    artist = $artistVariant
                    album = ""
                    hit = $geniusUsable
                    matched = ($null -ne $geniusFallback)
                })
                if ($geniusUsable) {
                    $script:LastLyricsLookupAttempts = @($attempts.ToArray())
                    return $geniusFallback
                }
            }
        }
    }
    catch {
        $script:LastLyricsLookupError = $_.Exception.Message
    }

    $script:LastLyricsLookupAttempts = @($attempts.ToArray())
    return $null
}

function Parse-Lrc {
    param(
        [string]$Text
    )

    $entries = New-Object System.Collections.Generic.List[object]
    if ([string]::IsNullOrWhiteSpace($Text)) {
        return @()
    }

    foreach ($line in ($Text -split "`r?`n")) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }

        $matches = [regex]::Matches($line, "\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]")
        if ($matches.Count -eq 0) { continue }

        $text = Repair-Mojibake -Text ([regex]::Replace($line, "\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]", "").Trim())
        foreach ($match in $matches) {
            $minutes = [int]$match.Groups[1].Value
            $seconds = [int]$match.Groups[2].Value
            $fraction = $match.Groups[3].Value
            $ms = 0

            if (-not [string]::IsNullOrWhiteSpace($fraction)) {
                if ($fraction.Length -eq 1) { $ms = [int]$fraction * 100 }
                elseif ($fraction.Length -eq 2) { $ms = [int]$fraction * 10 }
                else { $ms = [int]$fraction.Substring(0, 3) }
            }

            $entries.Add([pscustomobject]@{
                TimestampMs = ($minutes * 60000) + ($seconds * 1000) + $ms
                Text = $text
            })
        }
    }

    return @($entries | Sort-Object TimestampMs)
}

function Split-UnsyncedLyrics {
    param(
        [string]$Text
    )

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return @()
    }

    return @(
        $Text -split "`r?`n" |
            Where-Object { -not [string]::IsNullOrWhiteSpace($_) } |
            ForEach-Object { Repair-Mojibake -Text $_ }
    )
}

function Convert-SyncedLyricsToPlainLines {
    param(
        [string]$Text
    )

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return @()
    }

    return @(
        $Text -split "`r?`n" |
            ForEach-Object {
                [regex]::Replace($_, "\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]", "").Trim()
            } |
            Where-Object { -not [string]::IsNullOrWhiteSpace($_) } |
            ForEach-Object { Repair-Mojibake -Text $_ }
    )
}

function Convert-LyricsPayloadToTrackData {
    param(
        [object]$LyricsPayload
    )

    if ($null -eq $LyricsPayload) {
        return $null
    }

    $syncedText = Convert-LyricsValueToText -Value $LyricsPayload.syncedLyrics
    $plainText = Convert-LyricsValueToText -Value $LyricsPayload.plainLyrics

    $syncedEntries = @()
    $plainLines = @()

    try {
        $syncedEntries = @(Parse-Lrc -Text $syncedText)
    }
    catch {
        $syncedEntries = @()
    }

    try {
        $plainLines = @(Split-UnsyncedLyrics -Text $plainText)
    }
    catch {
        $plainLines = @()
    }

    if ($plainLines.Count -eq 0 -and -not [string]::IsNullOrWhiteSpace($syncedText)) {
        $plainLines = @(Convert-SyncedLyricsToPlainLines -Text $syncedText)
    }

    if ($syncedEntries.Count -eq 0 -and $plainLines.Count -eq 0) {
        return $null
    }

    return [pscustomobject]@{
        Synced = $syncedEntries
        Plain = $plainLines
        Raw = $LyricsPayload
    }
}

function Get-DistinctLyricsLanguages {
    param(
        [object[]]$SyncedEntries,
        [object[]]$PlainEntries
    )

    $languages = New-Object System.Collections.Generic.List[string]

    foreach ($entry in (@($SyncedEntries) + @($PlainEntries))) {
        if ($null -eq $entry) {
            continue
        }

        $sourceLanguageMember = $entry | Get-Member -Name SourceLanguage -MemberType AliasProperty, NoteProperty, Property, ScriptProperty -ErrorAction SilentlyContinue
        if ($null -eq $sourceLanguageMember) {
            continue
        }

        $value = [string]$entry.SourceLanguage
        if ([string]::IsNullOrWhiteSpace($value)) {
            continue
        }

        if ($value -match '^[a-z]{2}') {
            $languages.Add($matches[0])
        }
        else {
            $languages.Add($value)
        }
    }

    return @($languages | Select-Object -Unique)
}

function Test-DisplayableLyricsData {
    param(
        [object]$LyricsData
    )

    if ($null -eq $LyricsData) {
        return $false
    }

    try {
        $displayData = Convert-LyricsDataToDisplayData -LyricsData $LyricsData
        return (@($displayData.Synced).Count -gt 0) -or (@($displayData.Plain).Count -gt 0)
    }
    catch {
        return $false
    }
}

function Translate-Text {
    param(
        [AllowEmptyString()]
        [string]$Text,

        [Parameter(Mandatory = $true)]
        [string]$TargetLanguage,

        [Parameter(Mandatory = $true)]
        [string]$TranslationProvider,

        [Parameter(Mandatory = $true)]
        [hashtable]$Cache
    )

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return [pscustomobject]@{
            Translation = ""
            SourceLanguage = ""
            Applied = $false
        }
    }

    $cacheKey = "{0}|{1}|{2}" -f $TranslationProvider, $TargetLanguage, $Text
    if ($Cache.ContainsKey($cacheKey)) {
        return $Cache[$cacheKey]
    }

    switch ($TranslationProvider) {
        "none" {
            $result = [pscustomobject]@{
                Translation = ""
                SourceLanguage = ""
                Applied = $false
            }
        }
        "libretranslate" {
            $baseUrl = $env:LIBRETRANSLATE_URL
            if ([string]::IsNullOrWhiteSpace($baseUrl)) {
                throw "LIBRETRANSLATE_URL is required when the libretranslate provider is enabled."
            }

            $body = @{
                q      = $Text
                source = "auto"
                target = $TargetLanguage
                format = "text"
            }

            if (-not [string]::IsNullOrWhiteSpace($env:LIBRETRANSLATE_API_KEY)) {
                $body.api_key = $env:LIBRETRANSLATE_API_KEY
            }

            $response = Invoke-Utf8JsonRequest -Uri ($baseUrl.TrimEnd("/") + "/translate") `
                -Method "POST" `
                -ContentType "application/json" `
                -Body ($body | ConvertTo-Json) `
                -TimeoutSec 20

            $result = [pscustomobject]@{
                Translation = Repair-Mojibake -Text ([string]$response.translatedText)
                SourceLanguage = [string]$response.detectedLanguage.language
                Applied = -not [string]::IsNullOrWhiteSpace([string]$response.translatedText)
            }
        }
        "googleweb" {
            $uri = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl={0}&dt=t&q={1}" -f `
                [uri]::EscapeDataString($TargetLanguage), `
                [uri]::EscapeDataString($Text)

            $raw = Invoke-Utf8JsonRequest -Uri $uri -Method "GET" -TimeoutSec 20
            $segments = @($raw[0])
            $translatedText = Repair-Mojibake -Text ((($segments | ForEach-Object { [string]$_[0] }) -join "").Trim())
            $sourceLanguage = [string]$raw[2]
            $hint = Get-SourceLanguageHint -Text $Text
            if (-not [string]::IsNullOrWhiteSpace($hint)) {
                $sourceLanguage = $hint
            }

            $result = [pscustomobject]@{
                Translation = $translatedText
                SourceLanguage = $sourceLanguage
                Applied = -not [string]::IsNullOrWhiteSpace($translatedText)
            }
        }
        default {
            throw "Unsupported translation provider: $TranslationProvider"
        }
    }

    $Cache[$cacheKey] = $result
    return $result
}

function Get-PhoneticText {
    param(
        [AllowEmptyString()]
        [string]$Text,

        [string]$SourceLanguage,
        [string]$TargetLanguage,
        [string]$TranslationProvider,
        [hashtable]$Cache
    )

    if ([string]::IsNullOrWhiteSpace($Text) -or [string]::IsNullOrWhiteSpace($SourceLanguage)) {
        return ""
    }

    $needsPhonetic = $false
    foreach ($prefix in $script:PhoneticLanguagePrefixes) {
        if ($SourceLanguage -like "$prefix*") {
            $needsPhonetic = $true
            break
        }
    }

    if (-not $needsPhonetic) {
        return ""
    }

    $cacheKey = "phonetic|{0}|{1}|{2}" -f $TranslationProvider, $SourceLanguage, $Text
    if ($Cache.ContainsKey($cacheKey)) {
        return [string]$Cache[$cacheKey]
    }

    $phonetic = ""
    if ($TranslationProvider -eq "googleweb") {
        $uri = "https://translate.googleapis.com/translate_a/single?client=gtx&sl={0}&tl={1}&dt=rm&dt=t&q={2}" -f `
            [uri]::EscapeDataString($SourceLanguage), `
            [uri]::EscapeDataString($TargetLanguage), `
            [uri]::EscapeDataString($Text)

        try {
            $raw = Invoke-Utf8JsonRequest -Uri $uri -Method "GET" -TimeoutSec 20
            $segments = @($raw[0])
            $phonetic = ((@(
                foreach ($segment in $segments) {
                    if ($segment.Count -gt 3 -and -not [string]::IsNullOrWhiteSpace([string]$segment[3])) {
                        [string]$segment[3]
                    }
                }
            ) -join " ").Trim())
        }
        catch {
            $phonetic = ""
        }
    }

    $Cache[$cacheKey] = $phonetic
    return $phonetic
}

function Add-TranslationsToLyrics {
    param(
        [Parameter(Mandatory = $true)]
        [object]$LyricsData,

        [Parameter(Mandatory = $true)]
        [string]$TargetLanguage,

        [Parameter(Mandatory = $true)]
        [string]$TranslationProvider,

        [Parameter(Mandatory = $true)]
        [hashtable]$TranslationCache
    )

    $synced = foreach ($entry in $LyricsData.Synced) {
        if ([string]::IsNullOrWhiteSpace($entry.Text)) { continue }

        $fixedText = Repair-Mojibake -Text $entry.Text
        try {
            $translation = Translate-Text -Text $fixedText -TargetLanguage $TargetLanguage -TranslationProvider $TranslationProvider -Cache $TranslationCache
            $phonetic = Get-PhoneticText -Text $fixedText -SourceLanguage $translation.SourceLanguage -TargetLanguage $TargetLanguage -TranslationProvider $TranslationProvider -Cache $TranslationCache
        }
        catch {
            $translation = [pscustomobject]@{
                Translation = ""
                SourceLanguage = Get-SourceLanguageHint -Text $fixedText
                Applied = $false
            }
            $phonetic = ""
        }

        [pscustomobject]@{
            TimestampMs = $entry.TimestampMs
            Text = $fixedText
            Translation = $translation.Translation
            SourceLanguage = $translation.SourceLanguage
            TranslationApplied = $translation.Applied
            Phonetic = $phonetic
        }
    }

    $plain = foreach ($line in $LyricsData.Plain) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }

        $fixedText = Repair-Mojibake -Text $line
        try {
            $translation = Translate-Text -Text $fixedText -TargetLanguage $TargetLanguage -TranslationProvider $TranslationProvider -Cache $TranslationCache
            $phonetic = Get-PhoneticText -Text $fixedText -SourceLanguage $translation.SourceLanguage -TargetLanguage $TargetLanguage -TranslationProvider $TranslationProvider -Cache $TranslationCache
        }
        catch {
            $translation = [pscustomobject]@{
                Translation = ""
                SourceLanguage = Get-SourceLanguageHint -Text $fixedText
                Applied = $false
            }
            $phonetic = ""
        }

        [pscustomobject]@{
            Text = $fixedText
            Translation = $translation.Translation
            SourceLanguage = $translation.SourceLanguage
            TranslationApplied = $translation.Applied
            Phonetic = $phonetic
        }
    }

    $allLanguages = @(Get-DistinctLyricsLanguages -SyncedEntries $synced -PlainEntries $plain)

    $sourceLanguage = ""
    if ($allLanguages.Count -gt 1) {
        $sourceLanguage = "mixed"
    }
    elseif ($allLanguages.Count -eq 1) {
        $sourceLanguage = [string]$allLanguages[0]
    }

    return [pscustomobject]@{
        Synced = @($synced)
        Plain = @($plain)
        Raw = $LyricsData.Raw
        SourceLanguage = $sourceLanguage
    }
}

function Convert-LyricsDataToDisplayData {
    param(
        [Parameter(Mandatory = $true)]
        [object]$LyricsData
    )

    $synced = foreach ($entry in @($LyricsData.Synced)) {
        if ([string]::IsNullOrWhiteSpace($entry.Text)) { continue }

        $fixedText = Repair-Mojibake -Text $entry.Text
        [pscustomobject]@{
            TimestampMs = $entry.TimestampMs
            Text = $fixedText
            Translation = ""
            SourceLanguage = Get-SourceLanguageHint -Text $fixedText
            TranslationApplied = $false
            Phonetic = ""
        }
    }

    $plain = foreach ($line in @($LyricsData.Plain)) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }

        $fixedText = Repair-Mojibake -Text $line
        [pscustomobject]@{
            Text = $fixedText
            Translation = ""
            SourceLanguage = Get-SourceLanguageHint -Text $fixedText
            TranslationApplied = $false
            Phonetic = ""
        }
    }

    $allLanguages = @(Get-DistinctLyricsLanguages -SyncedEntries $synced -PlainEntries $plain)

    $sourceLanguage = ""
    if ($allLanguages.Count -gt 1) {
        $sourceLanguage = "mixed"
    }
    elseif ($allLanguages.Count -eq 1) {
        $sourceLanguage = [string]$allLanguages[0]
    }

    return [pscustomobject]@{
        Synced = @($synced)
        Plain = @($plain)
        Raw = $LyricsData.Raw
        SourceLanguage = $sourceLanguage
    }
}

function Get-TokenAlignments {
    param(
        [Parameter(Mandatory = $true)]
        [string]$OriginalText,

        [Parameter(Mandatory = $true)]
        [string]$TranslatedText,

        [string]$SourceLanguage,

        [Parameter(Mandatory = $true)]
        [string]$TargetLanguage,

        [Parameter(Mandatory = $true)]
        [string]$TranslationProvider,

        [Parameter(Mandatory = $true)]
        [hashtable]$TranslationCache
    )

    $sourceTokens = @(Split-LyricTokens -Text $OriginalText)
    $targetTokens = @(Split-LyricTokens -Text $TranslatedText)
    if ($sourceTokens.Count -eq 0 -or $targetTokens.Count -eq 0) {
        return @()
    }

    $pairs = New-Object System.Collections.Generic.List[object]
    $sourceIndex = 0
    $targetIndex = 0

    while ($sourceIndex -lt $sourceTokens.Count -and $targetIndex -lt $targetTokens.Count) {
        $best = $null
        $bestScore = -1

        for ($sourceSpan = 1; $sourceSpan -le [math]::Min(4, $sourceTokens.Count - $sourceIndex); $sourceSpan++) {
            $sourceGroup = ($sourceTokens[$sourceIndex..($sourceIndex + $sourceSpan - 1)] -join " ")
            $translation = Translate-Text -Text $sourceGroup -TargetLanguage $TargetLanguage -TranslationProvider $TranslationProvider -Cache $TranslationCache
            $gloss = Normalize-LyricText -Text $translation.Translation
            if ([string]::IsNullOrWhiteSpace($gloss)) {
                continue
            }

            $glossParts = @($gloss -split '\s+' | Where-Object { $_ })
            $searchEnd = [math]::Min($targetTokens.Count - 1, $targetIndex + 6)
            for ($candidateStart = $targetIndex; $candidateStart -le $searchEnd; $candidateStart++) {
                for ($targetSpan = 1; $targetSpan -le [math]::Min(4, $targetTokens.Count - $candidateStart); $targetSpan++) {
                    $targetGroup = ($targetTokens[$candidateStart..($candidateStart + $targetSpan - 1)] -join " ")
                    $candidate = Normalize-LyricText -Text $targetGroup
                    if ([string]::IsNullOrWhiteSpace($candidate)) {
                        continue
                    }

                    $candidateParts = @($candidate -split '\s+' | Where-Object { $_ })
                    $score = 0
                    if ($candidate -eq $gloss) {
                        $score = 120
                    }
                    elseif ($candidate -like "*$gloss*" -or $gloss -like "*$candidate*") {
                        $score = 92
                    }
                    else {
                        $shared = @($candidateParts | Where-Object { $glossParts -contains $_ }).Count
                        if ($shared -gt 0) {
                            $overlapRatio = $shared / [math]::Max($glossParts.Count, $candidateParts.Count)
                            $score = 56 + [math]::Round($overlapRatio * 34)
                        }
                    }

                    if ($sourceSpan -gt 1) { $score += 6 }
                    if ($targetSpan -gt 1) { $score += 6 }
                    if ($sourceSpan -gt 1 -and $targetSpan -gt 1) { $score += 8 }

                    $singleGlossWord = ($glossParts.Count -eq 1 -and $script:EnglishFunctionWords -contains $glossParts[0])
                    $singleCandidateWord = ($candidateParts.Count -eq 1 -and $script:EnglishFunctionWords -contains $candidateParts[0])
                    if ($sourceSpan -eq 1 -and $targetSpan -eq 1 -and ($singleGlossWord -or $singleCandidateWord)) {
                        $score -= 28
                    }

                    if ($sourceSpan -eq 1 -and $sourceTokens[$sourceIndex].Length -le 2) {
                        $score -= 12
                    }

                    $distancePenalty = ($candidateStart - $targetIndex) * 6
                    $score -= $distancePenalty

                    if ($score -gt $bestScore) {
                        $bestScore = $score
                        $best = [pscustomobject]@{
                            sourceStart = $sourceIndex
                            sourceEnd = $sourceIndex + $sourceSpan - 1
                            targetStart = $candidateStart
                            targetEnd = $candidateStart + $targetSpan - 1
                            sourceText = $sourceGroup
                            targetText = $targetGroup
                            gloss = $translation.Translation
                            confidence = [math]::Round(([math]::Min(100, [math]::Max(0, $score)) / 100.0), 2)
                        }
                    }
                }
            }
        }

        if ($null -ne $best -and $bestScore -ge 74) {
            $pairs.Add($best)
            $sourceIndex = $best.sourceEnd + 1
            $targetIndex = $best.targetEnd + 1
        }
        else {
            if (($sourceTokens.Count - $sourceIndex) -gt ($targetTokens.Count - $targetIndex)) {
                $sourceIndex++
            }
            else {
                $targetIndex++
            }
        }
    }

    return @($pairs)
}

function Get-TrackLyricsData {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Track
    )

    $durationSeconds = if ($Track.EndTimeMs -gt 0) { [int][math]::Round($Track.EndTimeMs / 1000) } else { 0 }
    $lyrics = Get-LrcLibLyrics -Title $Track.Title -Artist $Track.Artist -Album $Track.Album -DurationSeconds $durationSeconds
    if ($null -eq $lyrics) {
        return $null
    }
    $trackData = Convert-LyricsPayloadToTrackData -LyricsPayload $lyrics
    if (-not (Test-DisplayableLyricsData -LyricsData $trackData)) {
        return $null
    }

    return $trackData
}

function Get-CurrentLyricLine {
    param(
        [Parameter(Mandatory = $true)]
        [object[]]$Entries,

        [Parameter(Mandatory = $true)]
        [int]$PositionMs
    )

    if ($Entries.Count -eq 0) {
        return $null
    }

    for ($i = $Entries.Count - 1; $i -ge 0; $i--) {
        if ($PositionMs -ge $Entries[$i].TimestampMs) {
            return [pscustomobject]@{
                Previous = if ($i -gt 0) { $Entries[$i - 1] } else { $null }
                Current = $Entries[$i]
                Next = if ($i -lt ($Entries.Count - 1)) { $Entries[$i + 1] } else { $null }
                Index = $i
            }
        }
    }

    return [pscustomobject]@{
        Previous = $null
        Current = $null
        Next = $Entries[0]
        Index = -1
    }
}

function Format-Millis {
    param([int]$Milliseconds)

    $ts = [timespan]::FromMilliseconds([math]::Max(0, $Milliseconds))
    return "{0:mm}:{0:ss}" -f $ts
}

Export-ModuleMember -Function `
    Add-TranslationsToLyrics, `
    Convert-LyricsDataToDisplayData, `
    Format-Millis, `
    Get-AlbumArtFallbackUrl, `
    Get-CurrentLyricLine, `
    Get-LastLyricsLookupAttempts, `
    Get-LastLyricsLookupError, `
    Get-TokenAlignments, `
    Get-SpotifyTrack, `
    Get-TrackLyricsData, `
    Translate-Text
