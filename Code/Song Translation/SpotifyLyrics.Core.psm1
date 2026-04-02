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

function Normalize-LanguageSignalToken {
    param(
        [string]$Token
    )

    if ([string]::IsNullOrWhiteSpace($Token)) {
        return ""
    }

    $value = ([string]$Token).ToLowerInvariant()
    $value = [regex]::Replace($value, '([aeiouy])\1{1,}', '$1')
    $value = [regex]::Replace($value, '(.)\1{2,}', '$1')
    return $value
}

function Test-LyricTextHasReliableLanguageSignal {
    param(
        [string]$Text
    )

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return $false
    }

    $fixedText = Repair-Mojibake -Text $Text
    if ([string]::IsNullOrWhiteSpace($fixedText)) {
        return $false
    }

    if ($fixedText -match '\p{IsHiragana}|\p{IsKatakana}|\p{IsHangulSyllables}|\p{IsHangulJamo}|\p{IsCJKUnifiedIdeographs}|\p{IsCyrillic}|\p{IsGreek}|\p{IsArabic}') {
        return $true
    }

    $tokenMatches = [regex]::Matches($fixedText.ToLowerInvariant(), '\p{L}+')
    if ($tokenMatches.Count -eq 0) {
        return $false
    }

    $fillerTokens = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
    @(
        "ah", "oh", "ooh", "uh", "mm", "hmm", "hm", "la", "na", "da", "ha", "hey",
        "yo", "ya", "yah", "yeah", "woo", "woah", "whoa", "ay", "eh", "ohh", "ahh"
    ) | ForEach-Object { [void]$fillerTokens.Add($_) }

    $normalizedTokens = @(
        foreach ($match in $tokenMatches) {
            $normalized = Normalize-LanguageSignalToken -Token ([string]$match.Value)
            if (-not [string]::IsNullOrWhiteSpace($normalized)) {
                $normalized
            }
        }
    )

    if ($normalizedTokens.Count -eq 0) {
        return $false
    }

    $meaningfulTokens = @(
        foreach ($token in $normalizedTokens) {
            if (-not $fillerTokens.Contains($token)) {
                $token
            }
        }
    )

    if ($meaningfulTokens.Count -eq 0) {
        return $false
    }

    $uniqueMeaningful = @($meaningfulTokens | Select-Object -Unique)
    $totalMeaningfulLetters = (($meaningfulTokens | ForEach-Object { $_.Length }) | Measure-Object -Sum).Sum
    $hasLongMeaningfulToken = $meaningfulTokens | Where-Object { $_.Length -ge 4 } | Select-Object -First 1

    if ($hasLongMeaningfulToken) {
        return $true
    }

    if ($uniqueMeaningful.Count -ge 2 -and $totalMeaningfulLetters -ge 5) {
        return $true
    }

    return $false
}

function Resolve-LyricSourceLanguage {
    param(
        [string]$Text,
        [string]$DetectedSourceLanguage
    )

    $hint = Get-SourceLanguageHint -Text $Text
    if (-not [string]::IsNullOrWhiteSpace($hint)) {
        return $hint
    }

    if ([string]::IsNullOrWhiteSpace($DetectedSourceLanguage)) {
        return ""
    }

    if (-not (Test-LyricTextHasReliableLanguageSignal -Text $Text)) {
        return ""
    }

    if (-not (Test-LyricTextMatchesDetectedLanguage -Text $Text -DetectedSourceLanguage $DetectedSourceLanguage)) {
        return ""
    }

    if ($DetectedSourceLanguage -match '^[a-z]{2}') {
        return $matches[0]
    }

    return [string]$DetectedSourceLanguage
}

function Test-LyricTextMatchesDetectedLanguage {
    param(
        [string]$Text,
        [string]$DetectedSourceLanguage
    )

    if ([string]::IsNullOrWhiteSpace($Text) -or [string]::IsNullOrWhiteSpace($DetectedSourceLanguage)) {
        return $false
    }

    $fixedText = Repair-Mojibake -Text $Text
    $language = ([string]$DetectedSourceLanguage).ToLowerInvariant()

    switch -Regex ($language) {
        '^(ru|uk|bg|sr|mk|be)$' { return ($fixedText -match '\p{IsCyrillic}') }
        '^(ar|fa|ur)$' { return ($fixedText -match '\p{IsArabic}') }
        '^el$' { return ($fixedText -match '\p{IsGreek}') }
        '^ja$' { return ($fixedText -match '\p{IsHiragana}|\p{IsKatakana}|\p{IsCJKUnifiedIdeographs}') }
        '^ko$' { return ($fixedText -match '\p{IsHangulSyllables}|\p{IsHangulJamo}') }
        '^zh($|[-_])' { return ($fixedText -match '\p{IsCJKUnifiedIdeographs}') }
        default { return $true }
    }
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
        $response = Invoke-Utf8JsonRequest -Uri $uri -Method "GET" -TimeoutSec 4
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

function Get-AlignmentComparableText {
    param(
        [string]$Text
    )

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return ""
    }

    $fixed = Repair-Mojibake -Text $Text
    $ascii = Remove-Diacritics -Text $fixed
    return Normalize-LyricText -Text $ascii
}

function Get-AlignmentTokenOverlapScore {
    param(
        [string]$LeftText,
        [string]$RightText
    )

    $leftComparable = Get-AlignmentComparableText -Text $LeftText
    $rightComparable = Get-AlignmentComparableText -Text $RightText
    if ([string]::IsNullOrWhiteSpace($leftComparable) -or [string]::IsNullOrWhiteSpace($rightComparable)) {
        return 0
    }

    if ($leftComparable -eq $rightComparable) {
        return 1
    }

    if ($leftComparable -like "*$rightComparable*" -or $rightComparable -like "*$leftComparable*") {
        return 0.88
    }

    $leftTokens = @($leftComparable -split '\s+' | Where-Object { $_ })
    $rightTokens = @($rightComparable -split '\s+' | Where-Object { $_ })
    if ($leftTokens.Count -eq 0 -or $rightTokens.Count -eq 0) {
        return 0
    }

    $shared = @($leftTokens | Where-Object { $rightTokens -contains $_ }).Count
    if ($shared -eq 0) {
        return 0
    }

    return [math]::Round(($shared / [math]::Max($leftTokens.Count, $rightTokens.Count)), 4)
}

function Get-AlignmentTokenWindowText {
    param(
        [string[]]$Tokens,
        [int]$Start,
        [int]$End
    )

    if ($null -eq $Tokens -or $Tokens.Count -eq 0) {
        return ""
    }

    if ($Start -lt 0 -or $End -lt $Start -or $End -ge $Tokens.Count) {
        return ""
    }

    return (($Tokens[$Start..$End]) -join " ")
}

function Get-AlignmentContributionWindow {
    param(
        [string[]]$FullTokens,
        [string]$ReducedText
    )

    if ($null -eq $FullTokens -or $FullTokens.Count -eq 0) {
        return $null
    }

    if ([string]::IsNullOrWhiteSpace($ReducedText)) {
        return [pscustomobject]@{
            Start = 0
            End = $FullTokens.Count - 1
            UnmatchedCount = $FullTokens.Count
            GroupCount = 1
            Coverage = 1.0
        }
    }

    $fullComparable = @(
        foreach ($token in $FullTokens) {
            Get-AlignmentComparableText -Text $token
        }
    )
    $reducedComparable = @(
        foreach ($token in (Split-LyricTokens -Text $ReducedText)) {
            Get-AlignmentComparableText -Text $token
        }
    )

    $m = $fullComparable.Count
    $n = $reducedComparable.Count
    if ($m -eq 0) {
        return $null
    }

    if ($n -eq 0) {
        return [pscustomobject]@{
            Start = 0
            End = $m - 1
            UnmatchedCount = $m
            GroupCount = 1
            Coverage = 1.0
        }
    }

    $dp = New-Object 'object[]' ($m + 1)
    for ($row = 0; $row -le $m; $row++) {
        $dp[$row] = New-Object 'int[]' ($n + 1)
    }

    for ($row = $m - 1; $row -ge 0; $row--) {
        for ($col = $n - 1; $col -ge 0; $col--) {
            if (($fullComparable[$row] -eq $reducedComparable[$col]) -and -not [string]::IsNullOrWhiteSpace($fullComparable[$row])) {
                $dp[$row][$col] = $dp[$row + 1][$col + 1] + 1
            }
            else {
                $dp[$row][$col] = [math]::Max($dp[$row + 1][$col], $dp[$row][$col + 1])
            }
        }
    }

    $matchedIndices = New-Object 'System.Collections.Generic.HashSet[int]'
    $row = 0
    $col = 0
    while ($row -lt $m -and $col -lt $n) {
        if (($fullComparable[$row] -eq $reducedComparable[$col]) -and -not [string]::IsNullOrWhiteSpace($fullComparable[$row]) -and ($dp[$row][$col] -eq ($dp[$row + 1][$col + 1] + 1))) {
            [void]$matchedIndices.Add($row)
            $row++
            $col++
            continue
        }

        if ($dp[$row + 1][$col] -ge $dp[$row][$col + 1]) {
            $row++
        }
        else {
            $col++
        }
    }

    $unmatched = New-Object System.Collections.Generic.List[int]
    for ($index = 0; $index -lt $m; $index++) {
        if (-not $matchedIndices.Contains($index)) {
            $unmatched.Add($index)
        }
    }

    if ($unmatched.Count -eq 0) {
        return $null
    }

    $groupCount = 0
    $previous = -99
    foreach ($index in $unmatched) {
        if (($index - $previous) -gt 1) {
            $groupCount++
        }
        $previous = $index
    }

    $start = $unmatched[0]
    $end = $unmatched[$unmatched.Count - 1]
    $windowLength = $end - $start + 1
    $coverage = if ($windowLength -gt 0) { [math]::Round(($unmatched.Count / $windowLength), 4) } else { 0.0 }

    return [pscustomobject]@{
        Start = $start
        End = $end
        UnmatchedCount = $unmatched.Count
        GroupCount = $groupCount
        Coverage = $coverage
    }
}

function Add-AlignmentCandidate {
    param(
        [hashtable]$CandidateMap,
        [int]$SourceStart,
        [int]$SourceEnd,
        [int]$TargetStart,
        [int]$TargetEnd,
        [double]$Score,
        [string]$Method,
        [string]$SourceText,
        [string]$TargetText,
        [string]$Gloss = ""
    )

    if ($null -eq $CandidateMap -or $Score -le 0) {
        return
    }

    $key = "{0}:{1}|{2}:{3}" -f $SourceStart, $SourceEnd, $TargetStart, $TargetEnd
    if ($CandidateMap.ContainsKey($key)) {
        $existing = $CandidateMap[$key]
        if ($existing.methods -notcontains $Method) {
            $existing.methods += $Method
            $existing.score = [double]$existing.score + 4
        }

        if ($Score -gt [double]$existing.score) {
            $existing.score = $Score
            $existing.sourceText = $SourceText
            $existing.targetText = $TargetText
            $existing.gloss = $Gloss
        }

        $existing.confidence = [math]::Round([math]::Min(0.99, ([double]$existing.score / 100.0)), 2)
        return
    }

    $CandidateMap[$key] = [pscustomobject]@{
        sourceStart = $SourceStart
        sourceEnd = $SourceEnd
        targetStart = $TargetStart
        targetEnd = $TargetEnd
        sourceText = $SourceText
        targetText = $TargetText
        gloss = $Gloss
        score = $Score
        confidence = [math]::Round([math]::Min(0.99, ($Score / 100.0)), 2)
        methods = @($Method)
    }
}

function Get-AlignmentMarker {
    param(
        [int]$Index
    )

    return "XQKM{0:000}QKX" -f $Index
}

function Merge-AdjacentAlignmentPairs {
    param(
        [object[]]$Pairs,
        [string[]]$SourceTokens,
        [string[]]$TargetTokens
    )

    $sorted = @($Pairs | Sort-Object sourceStart, targetStart)
    if ($sorted.Count -le 1) {
        return $sorted
    }

    $merged = New-Object System.Collections.Generic.List[object]
    $index = 0
    while ($index -lt $sorted.Count) {
        $current = $sorted[$index]
        $nextIndex = $index + 1

        while ($nextIndex -lt $sorted.Count) {
            $next = $sorted[$nextIndex]
            $sourceAdjacent = ([int]$next.sourceStart -eq ([int]$current.sourceEnd + 1))
            $targetAdjacent = ([int]$next.targetStart -le ([int]$current.targetEnd + 2))
            $currentShort = ([string]$current.sourceText).Length -le 2
            $nextShort = ([string]$next.sourceText).Length -le 2

            if (-not ($sourceAdjacent -and $targetAdjacent -and ($currentShort -or $nextShort))) {
                break
            }

            $current = [pscustomobject]@{
                sourceStart = $current.sourceStart
                sourceEnd = $next.sourceEnd
                targetStart = $current.targetStart
                targetEnd = [math]::Max([int]$current.targetEnd, [int]$next.targetEnd)
                sourceText = Get-AlignmentTokenWindowText -Tokens $SourceTokens -Start $current.sourceStart -End $next.sourceEnd
                targetText = Get-AlignmentTokenWindowText -Tokens $TargetTokens -Start $current.targetStart -End ([math]::Max([int]$current.targetEnd, [int]$next.targetEnd))
                gloss = if (-not [string]::IsNullOrWhiteSpace([string]$current.gloss)) { $current.gloss } else { $next.gloss }
                confidence = [math]::Round(([math]::Max([double]$current.confidence, [double]$next.confidence) * 0.96), 2)
            }

            $nextIndex++
        }

        $merged.Add($current)
        $index = $nextIndex
    }

    return @($merged)
}

function Expand-AlignmentPairsOverSourceGaps {
    param(
        [object[]]$Pairs,
        [string[]]$SourceTokens,
        [string[]]$TargetTokens
    )

    $sorted = @($Pairs | Sort-Object sourceStart, targetStart)
    if ($sorted.Count -eq 0) {
        return @()
    }

    $expanded = New-Object System.Collections.Generic.List[object]
    for ($index = 0; $index -lt $sorted.Count; $index++) {
        $pair = $sorted[$index]
        $previousEnd = if ($index -gt 0) { [int]$expanded[$expanded.Count - 1].sourceEnd } else { -1 }
        $gapStart = $previousEnd + 1
        $gapEnd = [int]$pair.sourceStart - 1

        if ($gapStart -eq $gapEnd -and $gapStart -ge 0) {
            $gapToken = [string]$SourceTokens[$gapStart]
            $gapLooksAttachable = ($gapToken.Length -le 6) -or ($gapToken -match "['-]")
            if ($gapLooksAttachable) {
                $pair = [pscustomobject]@{
                    sourceStart = $gapStart
                    sourceEnd = $pair.sourceEnd
                    targetStart = $pair.targetStart
                    targetEnd = $pair.targetEnd
                    sourceText = Get-AlignmentTokenWindowText -Tokens $SourceTokens -Start $gapStart -End $pair.sourceEnd
                    targetText = Get-AlignmentTokenWindowText -Tokens $TargetTokens -Start $pair.targetStart -End $pair.targetEnd
                    gloss = $pair.gloss
                    confidence = [math]::Round(([double]$pair.confidence * 0.97), 2)
                }
            }
        }

        $expanded.Add($pair)
    }

    return @($expanded)
}

function Get-WrappedMarkerAlignmentPairs {
    param(
        [string[]]$SourceTokens,
        [string[]]$TargetTokens,
        [string]$SourceLanguage,
        [string]$TargetLanguage,
        [string]$TranslationProvider,
        [hashtable]$TranslationCache
    )

    if ($null -eq $SourceTokens -or $SourceTokens.Count -eq 0 -or $null -eq $TargetTokens -or $TargetTokens.Count -eq 0) {
        return @()
    }

    $wrappedParts = New-Object System.Collections.Generic.List[string]
    for ($index = 0; $index -lt $SourceTokens.Count; $index++) {
        $wrappedParts.Add(("<m{0:000}>{1}</m{0:000}>" -f $index, $SourceTokens[$index]))
    }

    try {
        $wrappedTranslation = Translate-TextWithSource `
            -Text ([string]::Join(" ", $wrappedParts.ToArray())) `
            -SourceLanguage $SourceLanguage `
            -TargetLanguage $TargetLanguage `
            -TranslationProvider $TranslationProvider `
            -Cache $TranslationCache
    }
    catch {
        return @()
    }

    $translatedWrappedText = [string]$wrappedTranslation.Translation
    if ([string]::IsNullOrWhiteSpace($translatedWrappedText)) {
        return @()
    }

    $matches = @([regex]::Matches($translatedWrappedText, '(?is)<m(?<id>\d{3})>(?<text>.*?)</m\k<id>>'))
    if ($matches.Count -eq 0) {
        return @()
    }

    $pairs = New-Object System.Collections.Generic.List[object]
    $targetCursor = 0
    foreach ($match in $matches) {
        $sourceIndex = [int]$match.Groups["id"].Value
        if ($sourceIndex -lt 0 -or $sourceIndex -ge $SourceTokens.Count) {
            continue
        }

        $segmentText = ([string]$match.Groups["text"].Value).Trim(" ", "`t", "`r", "`n", ",", ".", ";", ":", "!", "?")
        if ([string]::IsNullOrWhiteSpace($segmentText)) {
            continue
        }

        $segmentTokens = @(Split-LyricTokens -Text $segmentText)
        if ($segmentTokens.Count -eq 0) {
            continue
        }

        $best = $null
        $bestScore = -1.0
        $maxWindow = [math]::Min([math]::Max(6, $segmentTokens.Count + 2), $TargetTokens.Count)
        for ($candidateStart = $targetCursor; $candidateStart -lt $TargetTokens.Count; $candidateStart++) {
            for ($targetSpan = 1; $targetSpan -le [math]::Min($maxWindow, $TargetTokens.Count - $candidateStart); $targetSpan++) {
                $candidateEnd = $candidateStart + $targetSpan - 1
                $candidateText = Get-AlignmentTokenWindowText -Tokens $TargetTokens -Start $candidateStart -End $candidateEnd
                if ([string]::IsNullOrWhiteSpace($candidateText)) {
                    continue
                }

                $overlap = Get-AlignmentTokenOverlapScore -LeftText $segmentText -RightText $candidateText
                if ($overlap -lt 0.2) {
                    continue
                }

                $sourceCenter = ($sourceIndex + 0.5) / [math]::Max(1, $SourceTokens.Count)
                $targetCenter = ($candidateStart + (($targetSpan - 1) / 2.0)) / [math]::Max(1, $TargetTokens.Count)
                $positionSimilarity = [math]::Max(0.0, 1.0 - [math]::Abs($sourceCenter - $targetCenter))
                $score = ($overlap * 0.82) + ($positionSimilarity * 0.18)

                if ($score -gt $bestScore) {
                    $bestScore = $score
                    $best = [pscustomobject]@{
                        sourceStart = $sourceIndex
                        sourceEnd = $sourceIndex
                        targetStart = $candidateStart
                        targetEnd = $candidateEnd
                        sourceText = $SourceTokens[$sourceIndex]
                        targetText = $candidateText
                        gloss = $segmentText
                        confidence = [math]::Round($score, 2)
                    }
                }
            }
        }

        if ($null -ne $best -and $best.confidence -ge 0.42) {
            $pairs.Add($best)
            $targetCursor = [math]::Max($targetCursor, ([int]$best.targetEnd + 1))
        }
    }

    $merged = @(Merge-AdjacentAlignmentPairs -Pairs @($pairs) -SourceTokens $SourceTokens -TargetTokens $TargetTokens)
    return @(Expand-AlignmentPairsOverSourceGaps -Pairs $merged -SourceTokens $SourceTokens -TargetTokens $TargetTokens)
}

function Get-MarkerBasedAlignmentPairs {
    param(
        [string[]]$SourceTokens,
        [string[]]$TargetTokens,
        [string]$OriginalText,
        [string]$SourceLanguage,
        [string]$TargetLanguage,
        [string]$TranslationProvider,
        [hashtable]$TranslationCache
    )

    if ($null -eq $SourceTokens -or $SourceTokens.Count -eq 0 -or $null -eq $TargetTokens -or $TargetTokens.Count -eq 0) {
        return @()
    }

    $parts = New-Object System.Collections.Generic.List[string]
    for ($index = 0; $index -lt $SourceTokens.Count; $index++) {
        $parts.Add((Get-AlignmentMarker -Index $index))
        $parts.Add($SourceTokens[$index])
    }
    $parts.Add((Get-AlignmentMarker -Index $SourceTokens.Count))
    $markedSource = [string]::Join(" ", $parts.ToArray())

    try {
        $markedTranslation = Translate-TextWithSource `
            -Text $markedSource `
            -SourceLanguage $SourceLanguage `
            -TargetLanguage $TargetLanguage `
            -TranslationProvider $TranslationProvider `
            -Cache $TranslationCache
    }
    catch {
        return @()
    }

    $translatedMarkedText = [string]$markedTranslation.Translation
    if ([string]::IsNullOrWhiteSpace($translatedMarkedText)) {
        return @()
    }

    $pattern = 'XQKM(?<id>\d{3})QKX'
    $matches = @([regex]::Matches($translatedMarkedText, $pattern))
    if ($matches.Count -lt 2) {
        return @()
    }

    $matchesById = @{}
    foreach ($match in $matches) {
        $id = [int]$match.Groups["id"].Value
        if (-not $matchesById.ContainsKey($id)) {
            $matchesById[$id] = $match
        }
    }

    $pairs = New-Object System.Collections.Generic.List[object]
    $targetCursor = 0
    for ($sourceIndex = 0; $sourceIndex -lt $SourceTokens.Count; $sourceIndex++) {
        if (-not $matchesById.ContainsKey($sourceIndex) -or -not $matchesById.ContainsKey($sourceIndex + 1)) {
            continue
        }

        $startMatch = $matchesById[$sourceIndex]
        $endMatch = $matchesById[$sourceIndex + 1]
        if ($endMatch.Index -le $startMatch.Index) {
            continue
        }

        $segmentStart = $startMatch.Index + $startMatch.Length
        $segmentLength = $endMatch.Index - $segmentStart
        if ($segmentLength -le 0) {
            continue
        }

        $segmentText = ($translatedMarkedText.Substring($segmentStart, $segmentLength)).Trim(" ", "`t", "`r", "`n", ",", ".", ";", ":", "!", "?")
        if ([string]::IsNullOrWhiteSpace($segmentText)) {
            continue
        }

        $segmentTokens = @(Split-LyricTokens -Text $segmentText)
        if ($segmentTokens.Count -eq 0) {
            continue
        }

        $best = $null
        $bestScore = -1.0
        $maxWindow = [math]::Min([math]::Max(6, $segmentTokens.Count + 2), $TargetTokens.Count)
        for ($candidateStart = $targetCursor; $candidateStart -lt $TargetTokens.Count; $candidateStart++) {
            for ($targetSpan = 1; $targetSpan -le [math]::Min($maxWindow, $TargetTokens.Count - $candidateStart); $targetSpan++) {
                $candidateEnd = $candidateStart + $targetSpan - 1
                $candidateText = Get-AlignmentTokenWindowText -Tokens $TargetTokens -Start $candidateStart -End $candidateEnd
                if ([string]::IsNullOrWhiteSpace($candidateText)) {
                    continue
                }

                $overlap = Get-AlignmentTokenOverlapScore -LeftText $segmentText -RightText $candidateText
                if ($overlap -lt 0.2) {
                    continue
                }

                $sourceCenter = ($sourceIndex + 0.5) / [math]::Max(1, $SourceTokens.Count)
                $targetCenter = ($candidateStart + (($targetSpan - 1) / 2.0)) / [math]::Max(1, $TargetTokens.Count)
                $positionSimilarity = [math]::Max(0.0, 1.0 - [math]::Abs($sourceCenter - $targetCenter))
                $score = ($overlap * 0.78) + ($positionSimilarity * 0.22)

                if ($score -gt $bestScore) {
                    $bestScore = $score
                    $best = [pscustomobject]@{
                        sourceStart = $sourceIndex
                        sourceEnd = $sourceIndex
                        targetStart = $candidateStart
                        targetEnd = $candidateEnd
                        sourceText = $SourceTokens[$sourceIndex]
                        targetText = $candidateText
                        gloss = $segmentText
                        confidence = [math]::Round($score, 2)
                    }
                }
            }
        }

        if ($null -ne $best -and $best.confidence -ge 0.42) {
            $pairs.Add($best)
            $targetCursor = [math]::Max($targetCursor, ([int]$best.targetEnd + 1))
        }
    }

    return @(Merge-AdjacentAlignmentPairs -Pairs @($pairs) -SourceTokens $SourceTokens -TargetTokens $TargetTokens)
}

function Translate-TextWithSource {
    param(
        [AllowEmptyString()]
        [string]$Text,

        [string]$SourceLanguage = "auto",

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

    $effectiveSource = if ([string]::IsNullOrWhiteSpace($SourceLanguage)) { "auto" } else { $SourceLanguage }
    $cacheKey = "translate|{0}|{1}|{2}|{3}" -f $TranslationProvider, $effectiveSource, $TargetLanguage, $Text
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
                source = $effectiveSource
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

            $detectedSource = ""
            if ($effectiveSource -eq "auto") {
                $detectedSource = [string]$response.detectedLanguage.language
            }
            else {
                $detectedSource = $effectiveSource
            }

            $result = [pscustomobject]@{
                Translation = Repair-Mojibake -Text ([string]$response.translatedText)
                SourceLanguage = Resolve-LyricSourceLanguage -Text $Text -DetectedSourceLanguage $detectedSource
                Applied = -not [string]::IsNullOrWhiteSpace([string]$response.translatedText)
            }
        }
        "googleweb" {
            $uri = "https://translate.googleapis.com/translate_a/single?client=gtx&sl={0}&tl={1}&dt=t&q={2}" -f `
                [uri]::EscapeDataString($effectiveSource), `
                [uri]::EscapeDataString($TargetLanguage), `
                [uri]::EscapeDataString($Text)

            $raw = Invoke-Utf8JsonRequest -Uri $uri -Method "GET" -TimeoutSec 20
            $segments = @($raw[0])
            $translatedText = Repair-Mojibake -Text ((($segments | ForEach-Object { [string]$_[0] }) -join "").Trim())
            $detectedSource = if ($effectiveSource -eq "auto") { [string]$raw[2] } else { $effectiveSource }
            $hint = Get-SourceLanguageHint -Text $Text
            if ($effectiveSource -eq "auto" -and -not [string]::IsNullOrWhiteSpace($hint)) {
                $detectedSource = $hint
            }

            $result = [pscustomobject]@{
                Translation = $translatedText
                SourceLanguage = Resolve-LyricSourceLanguage -Text $Text -DetectedSourceLanguage $detectedSource
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

    return Translate-TextWithSource `
        -Text $Text `
        -SourceLanguage "auto" `
        -TargetLanguage $TargetLanguage `
        -TranslationProvider $TranslationProvider `
        -Cache $Cache
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

function Get-TranslationBatchMarker {
    param(
        [int]$Index
    )

    return "DLYQ{0:000}QYLD" -f $Index
}

function Get-BatchSourceLanguageHint {
    param(
        [string[]]$Texts,
        [string]$TargetLanguage,
        [string]$TranslationProvider,
        [hashtable]$TranslationCache
    )

    $candidates = @(
        $Texts |
            Where-Object { -not [string]::IsNullOrWhiteSpace($_) -and (Test-LyricTextHasReliableLanguageSignal -Text $_) } |
            Select-Object -Unique -First 3
    )

    if ($candidates.Count -lt 2) {
        return ""
    }

    $detectedLanguages = New-Object System.Collections.Generic.List[string]
    foreach ($text in $candidates) {
        try {
            $sample = Translate-Text -Text $text -TargetLanguage $TargetLanguage -TranslationProvider $TranslationProvider -Cache $TranslationCache
            if (-not [string]::IsNullOrWhiteSpace([string]$sample.SourceLanguage)) {
                $value = [string]$sample.SourceLanguage
                if ($value -match '^[a-z]{2}') {
                    $detectedLanguages.Add($matches[0])
                }
                else {
                    $detectedLanguages.Add($value)
                }
            }
        }
        catch {
        }
    }

    $distinctLanguages = @($detectedLanguages | Select-Object -Unique)
    if ($distinctLanguages.Count -eq 1) {
        return [string]$distinctLanguages[0]
    }

    return ""
}

function Translate-LinesBatch {
    param(
        [string[]]$Texts,
        [string]$SourceLanguage,
        [string]$TargetLanguage,
        [string]$TranslationProvider,
        [hashtable]$TranslationCache
    )

    if ($null -eq $Texts -or $Texts.Count -eq 0) {
        return @()
    }

    $parts = New-Object System.Collections.Generic.List[string]
    for ($index = 0; $index -lt $Texts.Count; $index++) {
        $parts.Add((Get-TranslationBatchMarker -Index $index))
        $parts.Add([string]$Texts[$index])
    }
    $parts.Add((Get-TranslationBatchMarker -Index $Texts.Count))

    $batchedText = [string]::Join("`n", $parts.ToArray())
    $translatedBatch = Translate-TextWithSource `
        -Text $batchedText `
        -SourceLanguage $SourceLanguage `
        -TargetLanguage $TargetLanguage `
        -TranslationProvider $TranslationProvider `
        -Cache $TranslationCache

    $translatedText = [string]$translatedBatch.Translation
    if ([string]::IsNullOrWhiteSpace($translatedText)) {
        return @()
    }

    $pattern = 'DLYQ(?<id>\d{3})QYLD'
    $matches = @([regex]::Matches($translatedText, $pattern))
    if ($matches.Count -lt ($Texts.Count + 1)) {
        return @()
    }

    $matchesById = @{}
    foreach ($match in $matches) {
        $id = [int]$match.Groups["id"].Value
        if (-not $matchesById.ContainsKey($id)) {
            $matchesById[$id] = $match
        }
    }

    $results = New-Object System.Collections.Generic.List[object]
    for ($index = 0; $index -lt $Texts.Count; $index++) {
        if (-not $matchesById.ContainsKey($index) -or -not $matchesById.ContainsKey($index + 1)) {
            return @()
        }

        $startMatch = $matchesById[$index]
        $endMatch = $matchesById[$index + 1]
        $segmentStart = $startMatch.Index + $startMatch.Length
        $segmentLength = $endMatch.Index - $segmentStart
        $segment = if ($segmentLength -gt 0) {
            $translatedText.Substring($segmentStart, $segmentLength).Trim()
        }
        else {
            ""
        }

        $results.Add([pscustomobject]@{
            Translation = $segment
            SourceLanguage = Resolve-LyricSourceLanguage -Text $Texts[$index] -DetectedSourceLanguage ([string]$translatedBatch.SourceLanguage)
            Applied = $translatedBatch.Applied
        })
    }

    return @($results.ToArray())
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

    $fixedSyncedEntries = @(
        foreach ($entry in $LyricsData.Synced) {
            if ([string]::IsNullOrWhiteSpace($entry.Text)) { continue }
            [pscustomobject]@{
                TimestampMs = $entry.TimestampMs
                Text = Repair-Mojibake -Text $entry.Text
            }
        }
    )

    $fixedPlainEntries = @(
        foreach ($line in $LyricsData.Plain) {
            if ([string]::IsNullOrWhiteSpace($line)) { continue }
            [pscustomobject]@{
                Text = Repair-Mojibake -Text $line
            }
        }
    )

    $probeTexts = if ($fixedSyncedEntries.Count -gt 0) {
        @($fixedSyncedEntries | ForEach-Object { [string]$_.Text })
    }
    else {
        @($fixedPlainEntries | ForEach-Object { [string]$_.Text })
    }

    $batchSourceLanguage = ""
    if ($probeTexts.Count -ge 8) {
        $batchSourceLanguage = Get-BatchSourceLanguageHint `
            -Texts $probeTexts `
            -TargetLanguage $TargetLanguage `
            -TranslationProvider $TranslationProvider `
            -TranslationCache $TranslationCache
    }

    $syncedBatchTranslations = @()
    $plainBatchTranslations = @()
    if (-not [string]::IsNullOrWhiteSpace($batchSourceLanguage)) {
        try {
            $syncedBatchTranslations = Translate-LinesBatch `
                -Texts @($fixedSyncedEntries | ForEach-Object { [string]$_.Text }) `
                -SourceLanguage $batchSourceLanguage `
                -TargetLanguage $TargetLanguage `
                -TranslationProvider $TranslationProvider `
                -TranslationCache $TranslationCache

            $plainBatchTranslations = Translate-LinesBatch `
                -Texts @($fixedPlainEntries | ForEach-Object { [string]$_.Text }) `
                -SourceLanguage $batchSourceLanguage `
                -TargetLanguage $TargetLanguage `
                -TranslationProvider $TranslationProvider `
                -TranslationCache $TranslationCache
        }
        catch {
            $syncedBatchTranslations = @()
            $plainBatchTranslations = @()
        }
    }

    $synced = for ($index = 0; $index -lt $fixedSyncedEntries.Count; $index++) {
        $entry = $fixedSyncedEntries[$index]
        $fixedText = [string]$entry.Text
        $translation = $null
        if ($index -lt $syncedBatchTranslations.Count) {
            $translation = $syncedBatchTranslations[$index]
        }
        else {
            try {
                $translation = Translate-Text -Text $fixedText -TargetLanguage $TargetLanguage -TranslationProvider $TranslationProvider -Cache $TranslationCache
            }
            catch {
                $translation = [pscustomobject]@{
                    Translation = ""
                    SourceLanguage = Resolve-LyricSourceLanguage -Text $fixedText -DetectedSourceLanguage (Get-SourceLanguageHint -Text $fixedText)
                    Applied = $false
                }
            }
        }

        $resolvedSourceLanguage = Resolve-LyricSourceLanguage -Text $fixedText -DetectedSourceLanguage $translation.SourceLanguage
        $phonetic = Get-PhoneticText -Text $fixedText -SourceLanguage $resolvedSourceLanguage -TargetLanguage $TargetLanguage -TranslationProvider $TranslationProvider -Cache $TranslationCache

        [pscustomobject]@{
            TimestampMs = $entry.TimestampMs
            Text = $fixedText
            Translation = $translation.Translation
            SourceLanguage = $resolvedSourceLanguage
            TranslationApplied = $translation.Applied
            Phonetic = $phonetic
        }
    }

    $plain = for ($index = 0; $index -lt $fixedPlainEntries.Count; $index++) {
        $entry = $fixedPlainEntries[$index]
        $fixedText = [string]$entry.Text
        $translation = $null
        if ($index -lt $plainBatchTranslations.Count) {
            $translation = $plainBatchTranslations[$index]
        }
        else {
            try {
                $translation = Translate-Text -Text $fixedText -TargetLanguage $TargetLanguage -TranslationProvider $TranslationProvider -Cache $TranslationCache
            }
            catch {
                $translation = [pscustomobject]@{
                    Translation = ""
                    SourceLanguage = Resolve-LyricSourceLanguage -Text $fixedText -DetectedSourceLanguage (Get-SourceLanguageHint -Text $fixedText)
                    Applied = $false
                }
            }
        }

        $resolvedSourceLanguage = Resolve-LyricSourceLanguage -Text $fixedText -DetectedSourceLanguage $translation.SourceLanguage
        $phonetic = Get-PhoneticText -Text $fixedText -SourceLanguage $resolvedSourceLanguage -TargetLanguage $TargetLanguage -TranslationProvider $TranslationProvider -Cache $TranslationCache

        [pscustomobject]@{
            Text = $fixedText
            Translation = $translation.Translation
            SourceLanguage = $resolvedSourceLanguage
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
            SourceLanguage = Resolve-LyricSourceLanguage -Text $fixedText -DetectedSourceLanguage (Get-SourceLanguageHint -Text $fixedText)
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
            SourceLanguage = Resolve-LyricSourceLanguage -Text $fixedText -DetectedSourceLanguage (Get-SourceLanguageHint -Text $fixedText)
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

    $effectiveSourceLanguage = ""
    if (-not [string]::IsNullOrWhiteSpace($SourceLanguage) -and $SourceLanguage -ne "mixed") {
        $effectiveSourceLanguage = $SourceLanguage
    }
    if ([string]::IsNullOrWhiteSpace($effectiveSourceLanguage)) {
        $effectiveSourceLanguage = Get-SourceLanguageHint -Text $OriginalText
    }

    $sourceLanguageForRequests = if ([string]::IsNullOrWhiteSpace($effectiveSourceLanguage)) { "auto" } else { $effectiveSourceLanguage }
    $candidateMap = @{}
    $maxSourceSpan = [math]::Min(3, $sourceTokens.Count)

    foreach ($pair in @(Get-WrappedMarkerAlignmentPairs `
        -SourceTokens $sourceTokens `
        -TargetTokens $targetTokens `
        -SourceLanguage $sourceLanguageForRequests `
        -TargetLanguage $TargetLanguage `
        -TranslationProvider $TranslationProvider `
        -TranslationCache $TranslationCache)) {
        Add-AlignmentCandidate `
            -CandidateMap $candidateMap `
            -SourceStart $pair.sourceStart `
            -SourceEnd $pair.sourceEnd `
            -TargetStart $pair.targetStart `
            -TargetEnd $pair.targetEnd `
            -Score ([math]::Max(52, [math]::Round([double]$pair.confidence * 100))) `
            -Method "wrapped_markers" `
            -SourceText $pair.sourceText `
            -TargetText $pair.targetText `
            -Gloss $pair.gloss
    }

    foreach ($pair in @(Get-MarkerBasedAlignmentPairs `
        -SourceTokens $sourceTokens `
        -TargetTokens $targetTokens `
        -OriginalText $OriginalText `
        -SourceLanguage $sourceLanguageForRequests `
        -TargetLanguage $TargetLanguage `
        -TranslationProvider $TranslationProvider `
        -TranslationCache $TranslationCache)) {
        Add-AlignmentCandidate `
            -CandidateMap $candidateMap `
            -SourceStart $pair.sourceStart `
            -SourceEnd $pair.sourceEnd `
            -TargetStart $pair.targetStart `
            -TargetEnd $pair.targetEnd `
            -Score ([math]::Max(48, [math]::Round([double]$pair.confidence * 100))) `
            -Method "markers" `
            -SourceText $pair.sourceText `
            -TargetText $pair.targetText `
            -Gloss $pair.gloss
    }

    for ($sourceStart = 0; $sourceStart -lt $sourceTokens.Count; $sourceStart++) {
        for ($sourceSpan = 1; $sourceSpan -le [math]::Min($maxSourceSpan, $sourceTokens.Count - $sourceStart); $sourceSpan++) {
            $sourceEnd = $sourceStart + $sourceSpan - 1
            $sourceGroup = Get-AlignmentTokenWindowText -Tokens $sourceTokens -Start $sourceStart -End $sourceEnd
            if ([string]::IsNullOrWhiteSpace($sourceGroup)) {
                continue
            }

            $remainingSourceTokens = New-Object System.Collections.Generic.List[string]
            for ($index = 0; $index -lt $sourceTokens.Count; $index++) {
                if ($index -lt $sourceStart -or $index -gt $sourceEnd) {
                    $remainingSourceTokens.Add($sourceTokens[$index])
                }
            }

            $forwardGloss = ""
            try {
                $forwardTranslation = Translate-TextWithSource `
                    -Text $sourceGroup `
                    -SourceLanguage $sourceLanguageForRequests `
                    -TargetLanguage $TargetLanguage `
                    -TranslationProvider $TranslationProvider `
                    -Cache $TranslationCache
                $forwardGloss = [string]$forwardTranslation.Translation
            }
            catch {
                $forwardGloss = ""
            }

            $contributionWindow = $null
            if ($remainingSourceTokens.Count -eq 0) {
                $contributionWindow = [pscustomobject]@{
                    Start = 0
                    End = $targetTokens.Count - 1
                    UnmatchedCount = $targetTokens.Count
                    GroupCount = 1
                    Coverage = 1.0
                }
            }
            else {
                $reducedSourceText = [string]::Join(" ", $remainingSourceTokens.ToArray())
                try {
                    $reducedTranslation = Translate-TextWithSource `
                        -Text $reducedSourceText `
                        -SourceLanguage $sourceLanguageForRequests `
                        -TargetLanguage $TargetLanguage `
                        -TranslationProvider $TranslationProvider `
                        -Cache $TranslationCache
                    $contributionWindow = Get-AlignmentContributionWindow -FullTokens $targetTokens -ReducedText ([string]$reducedTranslation.Translation)
                }
                catch {
                    $contributionWindow = $null
                }
            }

            if ($null -ne $contributionWindow) {
                $targetGroup = Get-AlignmentTokenWindowText -Tokens $targetTokens -Start $contributionWindow.Start -End $contributionWindow.End
                if (-not [string]::IsNullOrWhiteSpace($targetGroup)) {
                    $forwardOverlap = if (-not [string]::IsNullOrWhiteSpace($forwardGloss)) {
                        Get-AlignmentTokenOverlapScore -LeftText $forwardGloss -RightText $targetGroup
                    }
                    else {
                        0.0
                    }

                    $targetSpan = $contributionWindow.End - $contributionWindow.Start + 1
                    $sourceCenter = ($sourceStart + (($sourceSpan - 1) / 2.0)) / [math]::Max(1, $sourceTokens.Count)
                    $targetCenter = ($contributionWindow.Start + (($targetSpan - 1) / 2.0)) / [math]::Max(1, $targetTokens.Count)
                    $positionSimilarity = [math]::Max(0.0, 1.0 - [math]::Abs($sourceCenter - $targetCenter))
                    $sizePenalty = [math]::Max(0, $targetSpan - ($sourceSpan * 3))

                    $score = 46
                    $score += [math]::Round($contributionWindow.Coverage * 18)
                    $score += [math]::Round($positionSimilarity * 12)
                    $score += [math]::Round($forwardOverlap * 28)
                    if ($contributionWindow.GroupCount -eq 1) { $score += 8 }
                    if ($sourceSpan -gt 1) { $score += 6 }
                    if ($targetSpan -gt 1) { $score += 4 }
                    $score -= [math]::Max(0, ($contributionWindow.GroupCount - 1) * 12)
                    $score -= ($sizePenalty * 4)

                    if ($score -ge 42) {
                        Add-AlignmentCandidate `
                            -CandidateMap $candidateMap `
                            -SourceStart $sourceStart `
                            -SourceEnd $sourceEnd `
                            -TargetStart $contributionWindow.Start `
                            -TargetEnd $contributionWindow.End `
                            -Score $score `
                            -Method "ablation" `
                            -SourceText $sourceGroup `
                            -TargetText $targetGroup `
                            -Gloss $forwardGloss
                    }
                }
            }

            if (-not [string]::IsNullOrWhiteSpace($forwardGloss)) {
                $bestLexicalCandidate = $null
                $bestLexicalScore = -1.0

                for ($targetStart = 0; $targetStart -lt $targetTokens.Count; $targetStart++) {
                    for ($targetSpan = 1; $targetSpan -le [math]::Min(4, $targetTokens.Count - $targetStart); $targetSpan++) {
                        $targetEnd = $targetStart + $targetSpan - 1
                        $targetGroup = Get-AlignmentTokenWindowText -Tokens $targetTokens -Start $targetStart -End $targetEnd
                        if ([string]::IsNullOrWhiteSpace($targetGroup)) {
                            continue
                        }

                        $overlap = Get-AlignmentTokenOverlapScore -LeftText $forwardGloss -RightText $targetGroup
                        if ($overlap -lt 0.18) {
                            continue
                        }

                        $sourceCenter = ($sourceStart + (($sourceSpan - 1) / 2.0)) / [math]::Max(1, $sourceTokens.Count)
                        $targetCenter = ($targetStart + (($targetSpan - 1) / 2.0)) / [math]::Max(1, $targetTokens.Count)
                        $positionSimilarity = [math]::Max(0.0, 1.0 - [math]::Abs($sourceCenter - $targetCenter))
                        $lexicalScore = 24
                        $lexicalScore += [math]::Round($overlap * 52)
                        $lexicalScore += [math]::Round($positionSimilarity * 12)
                        if ($targetSpan -gt 1) { $lexicalScore += 4 }
                        if ($sourceSpan -gt 1) { $lexicalScore += 4 }

                        if ($lexicalScore -gt $bestLexicalScore) {
                            $bestLexicalScore = $lexicalScore
                            $bestLexicalCandidate = [pscustomobject]@{
                                Start = $targetStart
                                End = $targetEnd
                                Text = $targetGroup
                            }
                        }
                    }
                }

                if ($null -ne $bestLexicalCandidate -and $bestLexicalScore -ge 36) {
                    Add-AlignmentCandidate `
                        -CandidateMap $candidateMap `
                        -SourceStart $sourceStart `
                        -SourceEnd $sourceEnd `
                        -TargetStart $bestLexicalCandidate.Start `
                        -TargetEnd $bestLexicalCandidate.End `
                        -Score $bestLexicalScore `
                        -Method "lexical" `
                        -SourceText $sourceGroup `
                        -TargetText $bestLexicalCandidate.Text `
                        -Gloss $forwardGloss
                }
            }
        }
    }

    $candidates = @($candidateMap.Values | Where-Object { $_.confidence -ge 0.34 })
    if ($candidates.Count -eq 0) {
        return @()
    }

    $candidatesBySourceStart = @{}
    foreach ($candidate in $candidates) {
        $sourceKey = [string]$candidate.sourceStart
        if (-not $candidatesBySourceStart.ContainsKey($sourceKey)) {
            $candidatesBySourceStart[$sourceKey] = New-Object System.Collections.Generic.List[object]
        }
        $candidatesBySourceStart[$sourceKey].Add($candidate)
    }

    $dp = @{}
    $choice = @{}
    for ($sourceIndex = $sourceTokens.Count; $sourceIndex -ge 0; $sourceIndex--) {
        for ($targetIndex = $targetTokens.Count; $targetIndex -ge 0; $targetIndex--) {
            $stateKey = "{0}|{1}" -f $sourceIndex, $targetIndex
            $bestScore = 0.0
            $bestChoice = $null

            if ($sourceIndex -lt $sourceTokens.Count) {
                $skipSourceKey = "{0}|{1}" -f ($sourceIndex + 1), $targetIndex
                $skipSourceScore = if ($dp.ContainsKey($skipSourceKey)) { [double]$dp[$skipSourceKey] } else { 0.0 }
                if ($skipSourceScore -gt $bestScore) {
                    $bestScore = $skipSourceScore
                    $bestChoice = [pscustomobject]@{
                        Kind = "skip_source"
                    }
                }
            }

            if ($targetIndex -lt $targetTokens.Count) {
                $skipTargetKey = "{0}|{1}" -f $sourceIndex, ($targetIndex + 1)
                $skipTargetScore = if ($dp.ContainsKey($skipTargetKey)) { [double]$dp[$skipTargetKey] } else { 0.0 }
                if ($skipTargetScore -gt $bestScore) {
                    $bestScore = $skipTargetScore
                    $bestChoice = [pscustomobject]@{
                        Kind = "skip_target"
                    }
                }
            }

            $sourceKey = [string]$sourceIndex
            if ($candidatesBySourceStart.ContainsKey($sourceKey)) {
                foreach ($candidate in @($candidatesBySourceStart[$sourceKey])) {
                    if ($candidate.targetStart -lt $targetIndex) {
                        continue
                    }

                    $nextStateKey = "{0}|{1}" -f ($candidate.sourceEnd + 1), ($candidate.targetEnd + 1)
                    $nextScore = if ($dp.ContainsKey($nextStateKey)) { [double]$dp[$nextStateKey] } else { 0.0 }
                    $candidateScore = [double]$candidate.score + $nextScore
                    if ($candidateScore -gt $bestScore) {
                        $bestScore = $candidateScore
                        $bestChoice = [pscustomobject]@{
                            Kind = "candidate"
                            Candidate = $candidate
                        }
                    }
                }
            }

            $dp[$stateKey] = $bestScore
            $choice[$stateKey] = $bestChoice
        }
    }

    $pairs = New-Object System.Collections.Generic.List[object]
    $sourceCursor = 0
    $targetCursor = 0
    while ($sourceCursor -lt $sourceTokens.Count -or $targetCursor -lt $targetTokens.Count) {
        $stateKey = "{0}|{1}" -f $sourceCursor, $targetCursor
        if (-not $choice.ContainsKey($stateKey) -or $null -eq $choice[$stateKey]) {
            break
        }

        $selected = $choice[$stateKey]
        switch ($selected.Kind) {
            "skip_source" {
                $sourceCursor++
            }
            "skip_target" {
                $targetCursor++
            }
            "candidate" {
                $candidate = $selected.Candidate
                $pairs.Add([pscustomobject]@{
                    sourceStart = $candidate.sourceStart
                    sourceEnd = $candidate.sourceEnd
                    targetStart = $candidate.targetStart
                    targetEnd = $candidate.targetEnd
                    sourceText = $candidate.sourceText
                    targetText = $candidate.targetText
                    gloss = $candidate.gloss
                    confidence = $candidate.confidence
                })
                $sourceCursor = $candidate.sourceEnd + 1
                $targetCursor = $candidate.targetEnd + 1
            }
        }
    }

    $finalPairs = @($pairs | Sort-Object sourceStart, targetStart)
    return $finalPairs
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
