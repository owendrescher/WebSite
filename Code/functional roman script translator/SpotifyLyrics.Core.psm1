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
        return Invoke-RestMethod -Uri $uri -Method Get -Headers @{ Accept = "application/json" } -TimeoutSec 15
    }
    catch {
        return $null
    }
}

function Search-LrcLibLyrics {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Title,

        [Parameter(Mandatory = $true)]
        [string]$Artist,

        [int]$DurationSeconds
    )

    $query = @{
        track_name = $Title
        artist_name = $Artist
    }

    $pairs = foreach ($key in $query.Keys) {
        "{0}={1}" -f [uri]::EscapeDataString($key), [uri]::EscapeDataString([string]$query[$key])
    }

    $uri = "https://lrclib.net/api/search?{0}" -f ($pairs -join "&")

    try {
        $results = @(Invoke-RestMethod -Uri $uri -Method Get -Headers @{ Accept = "application/json" } -TimeoutSec 15)
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

            if ((Normalize-LyricText -Text ([string]$item.artistName)) -eq $normalizedArtist) { $score += 20 }

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
        $response = Invoke-RestMethod -Uri $uri -Method Get -Headers @{ Accept = "application/json" } -TimeoutSec 15
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

function Get-LrcLibLyrics {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Title,

        [Parameter(Mandatory = $true)]
        [string]$Artist,

        [string]$Album,
        [int]$DurationSeconds
    )

    $titleVariants = Get-TitleVariants -Title $Title

    foreach ($titleVariant in $titleVariants) {
        $exact = Invoke-LrcLibGet -Title $titleVariant -Artist $Artist -Album $Album -DurationSeconds $DurationSeconds
        if ($null -ne $exact) { return $exact }

        if (-not [string]::IsNullOrWhiteSpace($Album)) {
            $withoutAlbum = Invoke-LrcLibGet -Title $titleVariant -Artist $Artist -DurationSeconds $DurationSeconds
            if ($null -ne $withoutAlbum) { return $withoutAlbum }
        }
    }

    foreach ($titleVariant in $titleVariants) {
        $searched = Search-LrcLibLyrics -Title $titleVariant -Artist $Artist -DurationSeconds $DurationSeconds
        if ($null -ne $searched) { return $searched }
    }

    foreach ($titleVariant in $titleVariants) {
        $plainFallback = Get-LyricsOvhLyrics -Title $titleVariant -Artist $Artist
        if ($null -ne $plainFallback) { return $plainFallback }
    }

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

            $response = Invoke-RestMethod -Uri ($baseUrl.TrimEnd("/") + "/translate") `
                -Method Post `
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

            $raw = Invoke-RestMethod -Uri $uri -Method Get -TimeoutSec 20
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
            $raw = Invoke-RestMethod -Uri $uri -Method Get -TimeoutSec 20
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
        $translation = Translate-Text -Text $fixedText -TargetLanguage $TargetLanguage -TranslationProvider $TranslationProvider -Cache $TranslationCache
        $phonetic = Get-PhoneticText -Text $fixedText -SourceLanguage $translation.SourceLanguage -TargetLanguage $TargetLanguage -TranslationProvider $TranslationProvider -Cache $TranslationCache
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
        $translation = Translate-Text -Text $fixedText -TargetLanguage $TargetLanguage -TranslationProvider $TranslationProvider -Cache $TranslationCache
        $phonetic = Get-PhoneticText -Text $fixedText -SourceLanguage $translation.SourceLanguage -TargetLanguage $TargetLanguage -TranslationProvider $TranslationProvider -Cache $TranslationCache
        [pscustomobject]@{
            Text = $fixedText
            Translation = $translation.Translation
            SourceLanguage = $translation.SourceLanguage
            TranslationApplied = $translation.Applied
            Phonetic = $phonetic
        }
    }

    $sourceLanguage = ""
    $firstTranslatedSynced = $synced | Where-Object { -not [string]::IsNullOrWhiteSpace($_.SourceLanguage) } | Select-Object -First 1
    $firstTranslatedPlain = $plain | Where-Object { -not [string]::IsNullOrWhiteSpace($_.SourceLanguage) } | Select-Object -First 1
    if ($null -ne $firstTranslatedSynced) { $sourceLanguage = [string]$firstTranslatedSynced.SourceLanguage }
    elseif ($null -ne $firstTranslatedPlain) { $sourceLanguage = [string]$firstTranslatedPlain.SourceLanguage }

    return [pscustomobject]@{
        Synced = @($synced)
        Plain = @($plain)
        Raw = $LyricsData.Raw
        SourceLanguage = $sourceLanguage
    }
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

    return [pscustomobject]@{
        Synced = @(Parse-Lrc -Text ([string]$lyrics.syncedLyrics))
        Plain = @(Split-UnsyncedLyrics -Text ([string]$lyrics.plainLyrics))
        Raw = $lyrics
    }
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
    Format-Millis, `
    Get-CurrentLyricLine, `
    Get-SpotifyTrack, `
    Get-TrackLyricsData, `
    Translate-Text
