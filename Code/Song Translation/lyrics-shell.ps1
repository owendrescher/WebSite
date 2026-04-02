[CmdletBinding()]
param(
    [string]$TargetLanguage = "es",
    [ValidateSet("none", "libretranslate")]
    [string]$TranslationProvider = "none",
    [int]$PollIntervalMs = 1000,
    [switch]$IncludeUnsyncedFallback
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Import-Module (Join-Path $projectRoot "SpotifyLyrics.Core.psm1") -Force

$translationCache = @{}
$lastTrackKey = ""
$lastLyrics = $null

function Render-Screen {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Track,

        [object]$LyricsData
    )

    Clear-Host

    $positionMs = $Track.PositionMs
    if ($Track.PlaybackStatus -eq "Playing") {
        $positionMs += [int]((Get-Date) - [datetime]::Parse($Track.LastUpdatedIso)).TotalMilliseconds
    }

    Write-Host ("Spotify Translation Shell".PadRight(60, "="))
    Write-Host ""
    Write-Host ("Track  : {0}" -f $Track.Title)
    Write-Host ("Artist : {0}" -f $Track.Artist)
    if (-not [string]::IsNullOrWhiteSpace($Track.Album)) {
        Write-Host ("Album  : {0}" -f $Track.Album)
    }
    Write-Host ("Status : {0}" -f $Track.PlaybackStatus)
    Write-Host ("Time   : {0} / {1}" -f (Format-Millis $positionMs), (Format-Millis $Track.EndTimeMs))
    Write-Host ("Trans. : {0} -> {1}" -f $TranslationProvider, $TargetLanguage)
    Write-Host ""

    if ($null -eq $LyricsData) {
        Write-Host "No lyrics found yet."
        Write-Host "The shell will retry when the track changes."
        return
    }

    if ($LyricsData.Synced.Count -gt 0) {
        $active = Get-CurrentLyricLine -Entries $LyricsData.Synced -PositionMs $positionMs
        if ($null -ne $active.Previous) {
            Write-Host ("Prev   : {0}" -f $active.Previous.Text) -ForegroundColor DarkGray
        }

        if ($null -ne $active.Current) {
            Write-Host ("Now    : {0}" -f $active.Current.Text) -ForegroundColor Cyan
            if (-not [string]::IsNullOrWhiteSpace($active.Current.Translation)) {
                Write-Host ("        {0}" -f $active.Current.Translation) -ForegroundColor Yellow
            }
        }
        else {
            Write-Host "Now    : [instrumental / waiting for first line]" -ForegroundColor Cyan
        }

        if ($null -ne $active.Next) {
            Write-Host ("Next   : {0}" -f $active.Next.Text) -ForegroundColor DarkGray
        }

        return
    }

    if ($IncludeUnsyncedFallback -and $LyricsData.Plain.Count -gt 0) {
        Write-Host "Unsynced lyrics only for this song." -ForegroundColor DarkYellow
        Write-Host ""

        $index = 0
        foreach ($line in $LyricsData.Plain | Select-Object -First 12) {
            Write-Host ("{0,2}. {1}" -f ($index + 1), $line.Text)
            if (-not [string]::IsNullOrWhiteSpace($line.Translation)) {
                Write-Host ("    {0}" -f $line.Translation) -ForegroundColor Yellow
            }
            $index++
        }

        return
    }

    Write-Host "Lyrics were found, but there is no synced timing data."
    if (-not $IncludeUnsyncedFallback) {
        Write-Host "Re-run with -IncludeUnsyncedFallback to display plain lines."
    }
}

while ($true) {
    try {
        $track = Get-SpotifyTrack

        if ($null -eq $track) {
            Clear-Host
            Write-Host "Spotify Translation Shell".PadRight(60, "=")
            Write-Host ""
            Write-Host "No Spotify media session detected."
            Write-Host "Start playing a track in Spotify, then this shell will attach automatically."
            Start-Sleep -Milliseconds $PollIntervalMs
            continue
        }

        if ($track.TrackKey -ne $lastTrackKey) {
            $baseLyrics = Get-TrackLyricsData -Track $track
            $lastLyrics = if ($null -eq $baseLyrics) {
                $null
            }
            else {
                Add-TranslationsToLyrics -LyricsData $baseLyrics -TargetLanguage $TargetLanguage -TranslationProvider $TranslationProvider -TranslationCache $translationCache
            }

            $lastTrackKey = $track.TrackKey
        }

        Render-Screen -Track $track -LyricsData $lastLyrics
    }
    catch {
        Clear-Host
        Write-Host "Spotify Translation Shell".PadRight(60, "=")
        Write-Host ""
        Write-Host "Error:"
        Write-Host $_.Exception.Message -ForegroundColor Red
    }

    Start-Sleep -Milliseconds $PollIntervalMs
}
