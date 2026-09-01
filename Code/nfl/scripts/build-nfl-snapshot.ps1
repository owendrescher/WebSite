param(
  [int]$EvidenceSeason = 2025,
  [int]$RosterSeason = 2026
)

$ErrorActionPreference = 'Stop'
$workspace = Split-Path -Parent $PSScriptRoot

function Normalize-Name([string]$Value) {
  if ($null -eq $Value) { $Value = '' }
  return ([regex]::Replace($Value.ToLowerInvariant(), '[^a-z0-9]', ''))
}

function Download-Csv([string]$Uri) {
  return (Invoke-RestMethod -Uri $Uri | ConvertFrom-Csv)
}

function As-Number($Value) {
  $number = 0.0
  if ([double]::TryParse([string]$Value, [Globalization.NumberStyles]::Any, [Globalization.CultureInfo]::InvariantCulture, [ref]$number)) { return $number }
  return 0.0
}

function Normalize-Team([string]$Value) {
  $team = $Value.ToUpperInvariant()
  if ($team -eq 'JAC') { return 'JAX' }
  if ($team -eq 'LAR') { return 'LA' }
  if ($team -eq 'WSH') { return 'WAS' }
  return $team
}

function Read-CsvStream([IO.Stream]$Stream, [scriptblock]$OnRow) {
  Add-Type -AssemblyName Microsoft.VisualBasic
  $parser = [Microsoft.VisualBasic.FileIO.TextFieldParser]::new($Stream)
  $parser.TextFieldType = [Microsoft.VisualBasic.FileIO.FieldType]::Delimited
  $parser.SetDelimiters(',')
  $parser.HasFieldsEnclosedInQuotes = $true
  try {
    if ($parser.EndOfData) { return }
    $header = $parser.ReadFields()
    $index = @{}
    for ($i = 0; $i -lt $header.Length; $i++) { $index[$header[$i]] = $i }
    while (-not $parser.EndOfData) {
      $fields = $parser.ReadFields()
      if ($fields) { & $OnRow $fields $index }
    }
  } finally { $parser.Dispose() }
}

function New-SplitAccumulator {
  return [ordered]@{ plays=0; successes=0; yards=0.0; epa=0.0; sacks=0 }
}

function Add-Split($Split, $Success, $Yards, $Epa, $Sack) {
  $Split.plays += 1
  if ((As-Number $Success) -ge 1) { $Split.successes += 1 }
  $Split.yards += As-Number $Yards
  $Split.epa += As-Number $Epa
  if ((As-Number $Sack) -ge 1) { $Split.sacks += 1 }
}

function Finish-Split($Split) {
  $plays = [math]::Max(0, [int]$Split.plays)
  return [ordered]@{
    plays=$plays
    successRate=$(if ($plays) { $Split.successes / $plays } else { $null })
    yardsPerPlay=$(if ($plays) { $Split.yards / $plays } else { $null })
    epaPerPlay=$(if ($plays) { $Split.epa / $plays } else { $null })
    sackRate=$(if ($plays) { $Split.sacks / $plays } else { $null })
  }
}

$statUri = "https://github.com/nflverse/nflverse-data/releases/download/stats_player/stats_player_week_$EvidenceSeason.csv"
$snapUri = "https://github.com/nflverse/nflverse-data/releases/download/snap_counts/snap_counts_$EvidenceSeason.csv"
$weeklyUri = "https://github.com/nflverse/nflverse-data/releases/download/weekly_rosters/roster_weekly_$RosterSeason.csv"
$depthUri = "https://github.com/nflverse/nflverse-data/releases/download/depth_charts/depth_charts_$RosterSeason.csv"
$teamStatUri = "https://github.com/nflverse/nflverse-data/releases/download/stats_team/stats_team_week_$EvidenceSeason.csv"
$participationUri = "https://github.com/nflverse/nflverse-data/releases/download/pbp_participation/pbp_participation_$EvidenceSeason.csv"
$ftnUri = "https://github.com/nflverse/nflverse-data/releases/download/ftn_charting/ftn_charting_$EvidenceSeason.csv"
$pbpUri = "https://github.com/nflverse/nflverse-data/releases/download/pbp/play_by_play_$EvidenceSeason.csv.gz"

$sumMap = [ordered]@{
  completions='completions'; attempts='attempts'; passingyards='passing_yards'; passingtouchdowns='passing_tds'; interceptions='passing_interceptions'; passingfirstdowns='passing_first_downs'; passingepa='passing_epa';
  carries='carries'; rushingyards='rushing_yards'; rushingtouchdowns='rushing_tds'; rushingfirstdowns='rushing_first_downs'; rushingepa='rushing_epa'; receptions='receptions'; targets='targets';
  receivingyards='receiving_yards'; receivingtouchdowns='receiving_tds'; receivingfirstdowns='receiving_first_downs'; receivingepa='receiving_epa'; receivingairyards='receiving_air_yards'; receivingyardsaftercatch='receiving_yards_after_catch';
  tacklessolo='def_tackles_solo'; tackleswithassist='def_tackles_with_assist'; tackleassists='def_tackle_assists'; tacklesforloss='def_tackles_for_loss'; fumblesforced='def_fumbles_forced';
  sacks='def_sacks'; qbhits='def_qb_hits'; defensiveinterceptions='def_interceptions'; passdefended='def_pass_defended'; defensivetouchdowns='def_tds'; specialteamstds='special_teams_tds'; fantasypoints='fantasy_points'; fantasypointsppr='fantasy_points_ppr'
}

$records = @{}
function Get-Record([string]$Name, [string]$GsisId = '', [string]$PfrId = '') {
  $key = Normalize-Name $Name
  if (-not $records.ContainsKey($key)) {
    $sums = [ordered]@{}
    foreach ($canonical in $sumMap.Keys) { $sums[$canonical] = 0.0 }
    $records[$key] = [ordered]@{ name=$Name; gsisId=$GsisId; pfrId=$PfrId; position=''; season=$EvidenceSeason; previousTeams=[ordered]@{}; games=0; snapGameCount=0; sums=$sums; offenseSnaps=0; defenseSnaps=0; specialTeamsSnaps=0; offenseStarts=0; defenseStarts=0; offensePctTotal=0.0; defensePctTotal=0.0; cpoeTotal=0.0; cpoeWeight=0.0; targetShareTotal=0.0; targetShareWeight=0.0 }
  }
  $record = $records[$key]
  if ($GsisId) { $record.gsisId = $GsisId }
  if ($PfrId) { $record.pfrId = $PfrId }
  return $record
}

$stats = Download-Csv $statUri
foreach ($row in $stats) {
  if ($row.season_type -and $row.season_type -ne 'REG') { continue }
  $record = Get-Record $row.player_display_name $row.player_id
  $priorTeam = Normalize-Team $row.recent_team
  if ($priorTeam) { $record.previousTeams[$priorTeam] = 1 + [int]$(if ($record.previousTeams[$priorTeam]) { $record.previousTeams[$priorTeam] } else { 0 }) }
  if (-not $record.position) { $record.position = [string]$(if ($row.position_group) { $row.position_group } elseif ($row.position) { $row.position } else { '' }) }
  $record.games += 1
  foreach ($canonical in $sumMap.Keys) {
    $source = $sumMap[$canonical]
    $value = 0.0
    [void][double]::TryParse([string]$row.$source, [ref]$value)
    $record.sums[$canonical] += $value
  }
  $attemptWeight = [math]::Max(1, [double]$(if ($row.attempts) { $row.attempts } else { 0 })); $cpoe = 0.0
  if ([double]::TryParse([string]$row.passing_cpoe, [ref]$cpoe)) { $record.cpoeTotal += $cpoe * $attemptWeight; $record.cpoeWeight += $attemptWeight }
  $targetWeight = [math]::Max(1, [double]$(if ($row.targets) { $row.targets } else { 0 })); $targetShare = 0.0
  if ([double]::TryParse([string]$row.target_share, [ref]$targetShare)) { $record.targetShareTotal += $targetShare * $targetWeight; $record.targetShareWeight += $targetWeight }
}

$snaps = Download-Csv $snapUri
foreach ($row in $snaps) {
  if ($row.game_type -and $row.game_type -ne 'REG') { continue }
  $record = Get-Record $row.player '' $row.pfr_player_id
  $priorTeam = Normalize-Team $row.team
  if ($priorTeam) { $record.previousTeams[$priorTeam] = 1 + [int]$(if ($record.previousTeams[$priorTeam]) { $record.previousTeams[$priorTeam] } else { 0 }) }
  if (-not $record.position -and $row.position) { $record.position = [string]$row.position }
  $offensePct = [double]$(if ($row.offense_pct) { $row.offense_pct } else { 0 }); $defensePct = [double]$(if ($row.defense_pct) { $row.defense_pct } else { 0 })
  $record.snapGameCount += 1; $record.offenseSnaps += [int]$(if ($row.offense_snaps) { $row.offense_snaps } else { 0 }); $record.defenseSnaps += [int]$(if ($row.defense_snaps) { $row.defense_snaps } else { 0 }); $record.specialTeamsSnaps += [int]$(if ($row.st_snaps) { $row.st_snaps } else { 0 })
  $record.offensePctTotal += $offensePct; $record.defensePctTotal += $defensePct
  if ($offensePct -ge .5) { $record.offenseStarts += 1 }
  if ($defensePct -ge .5) { $record.defenseStarts += 1 }
}

$evidence = foreach ($record in $records.Values) {
  $record.offenseSnapShare = if ($record.snapGameCount) { $record.offensePctTotal / $record.snapGameCount } else { 0 }
  $record.defenseSnapShare = if ($record.snapGameCount) { $record.defensePctTotal / $record.snapGameCount } else { 0 }
  $record.cpoe = if ($record.cpoeWeight) { $record.cpoeTotal / $record.cpoeWeight } else { 0 }
  $record.targetshare = if ($record.targetShareWeight) { $record.targetShareTotal / $record.targetShareWeight } else { 0 }
  $record.previousTeams = @($record.previousTeams.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object { $_.Key })
  foreach ($field in @('cpoeTotal','cpoeWeight','targetShareTotal','targetShareWeight')) { $record.Remove($field) }
  [pscustomobject]$record
}

$weekly = Download-Csv $weeklyUri
$latestWeek = ($weekly | Measure-Object -Property week -Maximum).Maximum
$weekly = @($weekly | Where-Object { [int]$_.week -eq [int]$latestWeek })

$depthText = Invoke-RestMethod -Uri $depthUri
$firstBreak = $depthText.IndexOf("`n")
$depthHeader = $depthText.Substring(0, $firstBreak).TrimEnd("`r")
$firstDataEnd = $depthText.IndexOf("`n", $firstBreak + 1)
$firstData = $depthText.Substring($firstBreak + 1, $firstDataEnd - $firstBreak - 1).TrimEnd("`r")
$latestStamp = $firstData.Split(',')[0]
$matchingDepth = [regex]::Matches($depthText, "(?m)^$([regex]::Escape($latestStamp)),[^`r`n]+") | ForEach-Object { $_.Value }
$depth = @((@($depthHeader) + @($matchingDepth)) -join "`n" | ConvertFrom-Csv)

$baseFronts = @{}
foreach ($row in $depth) {
  $team = Normalize-Team $row.club_code
  if (-not $team) { $team = Normalize-Team $row.team }
  $group = [string]$row.pos_grp
  if ($group -match 'Base\s+4-3\s+D') { $baseFronts[$team] = '4-3' }
  elseif ($group -match 'Base\s+3-4\s+D') { $baseFronts[$team] = '3-4' }
}

$teamStats = @(Download-Csv $teamStatUri | Where-Object { -not $_.season_type -or $_.season_type -eq 'REG' })
$teamByGame = @{}
foreach ($row in $teamStats) { $teamByGame["$($row.game_id)|$(Normalize-Team $row.team)"] = $row }
$teamTotals = @{}
foreach ($row in $teamStats) {
  $team = Normalize-Team $row.team
  if (-not $teamTotals.ContainsKey($team)) {
    $teamTotals[$team] = [ordered]@{ team=$team; games=0; carries=0.0; rushingYards=0.0; rushingEpa=0.0; rushingFirstDowns=0.0; attempts=0.0; passingYards=0.0; passingEpa=0.0; passingCpoeWeighted=0.0; passingTds=0.0; passingInts=0.0; sacksSuffered=0.0; opponentCarries=0.0; opponentRushingYards=0.0; opponentRushingEpa=0.0; opponentRushingFirstDowns=0.0; opponentAttempts=0.0; opponentPassingYards=0.0; opponentPassingEpa=0.0; opponentPassingTds=0.0; opponentPassingInts=0.0; opponentSacks=0.0; qbHits=0.0; tacklesForLoss=0.0 }
  }
  $total = $teamTotals[$team]
  $opponent = Normalize-Team $row.opponent_team
  $opponentRow = $teamByGame["$($row.game_id)|$opponent"]
  $attempts = As-Number $row.attempts
  $total.games += 1
  $total.carries += As-Number $row.carries; $total.rushingYards += As-Number $row.rushing_yards; $total.rushingEpa += As-Number $row.rushing_epa; $total.rushingFirstDowns += As-Number $row.rushing_first_downs
  $total.attempts += $attempts; $total.passingYards += As-Number $row.passing_yards; $total.passingEpa += As-Number $row.passing_epa; $total.passingCpoeWeighted += (As-Number $row.passing_cpoe) * $attempts; $total.passingTds += As-Number $row.passing_tds; $total.passingInts += As-Number $row.passing_interceptions; $total.sacksSuffered += As-Number $row.sacks_suffered
  $total.qbHits += As-Number $row.def_qb_hits; $total.tacklesForLoss += As-Number $row.def_tackles_for_loss
  if ($opponentRow) {
    $total.opponentCarries += As-Number $opponentRow.carries; $total.opponentRushingYards += As-Number $opponentRow.rushing_yards; $total.opponentRushingEpa += As-Number $opponentRow.rushing_epa; $total.opponentRushingFirstDowns += As-Number $opponentRow.rushing_first_downs
    $total.opponentAttempts += As-Number $opponentRow.attempts; $total.opponentPassingYards += As-Number $opponentRow.passing_yards; $total.opponentPassingEpa += As-Number $opponentRow.passing_epa; $total.opponentPassingTds += As-Number $opponentRow.passing_tds; $total.opponentPassingInts += As-Number $opponentRow.passing_interceptions; $total.opponentSacks += As-Number $opponentRow.sacks_suffered
  }
}

$teamUnits = foreach ($total in $teamTotals.Values) {
  $dropbacks = $total.attempts + $total.sacksSuffered
  $opponentDropbacks = $total.opponentAttempts + $total.opponentSacks
  [pscustomobject][ordered]@{
    team=$total.team; games=$total.games
    runGame=[ordered]@{ carries=$total.carries; yards=$total.rushingYards; yardsPerCarry=$(if($total.carries){$total.rushingYards/$total.carries}else{$null}); epaPerCarry=$(if($total.carries){$total.rushingEpa/$total.carries}else{$null}); firstDownRate=$(if($total.carries){$total.rushingFirstDowns/$total.carries}else{$null}) }
    passGame=[ordered]@{ dropbacks=$dropbacks; yards=$total.passingYards; yardsPerDropback=$(if($dropbacks){$total.passingYards/$dropbacks}else{$null}); epaPerDropback=$(if($dropbacks){$total.passingEpa/$dropbacks}else{$null}); cpoe=$(if($total.attempts){$total.passingCpoeWeighted/$total.attempts}else{$null}); touchdownRate=$(if($total.attempts){$total.passingTds/$total.attempts}else{$null}); interceptionRate=$(if($total.attempts){$total.passingInts/$total.attempts}else{$null}) }
    pocketProtection=[ordered]@{ dropbacks=$dropbacks; sacks=$total.sacksSuffered; sackRate=$(if($dropbacks){$total.sacksSuffered/$dropbacks}else{$null}) }
    passDefense=[ordered]@{ dropbacks=$opponentDropbacks; yards=$total.opponentPassingYards; yardsPerDropback=$(if($opponentDropbacks){$total.opponentPassingYards/$opponentDropbacks}else{$null}); epaPerDropback=$(if($opponentDropbacks){$total.opponentPassingEpa/$opponentDropbacks}else{$null}); touchdownRate=$(if($total.opponentAttempts){$total.opponentPassingTds/$total.opponentAttempts}else{$null}); interceptionRate=$(if($total.opponentAttempts){$total.opponentPassingInts/$total.opponentAttempts}else{$null}) }
    passRush=[ordered]@{ opponentDropbacks=$opponentDropbacks; sacks=$total.opponentSacks; qbHits=$total.qbHits; sackRate=$(if($opponentDropbacks){$total.opponentSacks/$opponentDropbacks}else{$null}); hitRate=$(if($total.opponentAttempts){$total.qbHits/$total.opponentAttempts}else{$null}) }
    runDefense=[ordered]@{ carries=$total.opponentCarries; yards=$total.opponentRushingYards; yardsPerCarry=$(if($total.opponentCarries){$total.opponentRushingYards/$total.opponentCarries}else{$null}); epaPerCarry=$(if($total.opponentCarries){$total.opponentRushingEpa/$total.opponentCarries}else{$null}); firstDownRate=$(if($total.opponentCarries){$total.opponentRushingFirstDowns/$total.opponentCarries}else{$null}); tackleForLossRate=$(if($total.opponentCarries){$total.tacklesForLoss/$total.opponentCarries}else{$null}) }
  }
}

$schemeTotals = @{}
function Get-SchemeTotal([string]$Team) {
  $normalized = Normalize-Team $Team
  if (-not $schemeTotals.ContainsKey($normalized)) {
    $schemeTotals[$normalized] = [ordered]@{ team=$normalized; coveragePlays=0; man=0; zone=0; pressureRows=0; pressures=0; blitzRows=0; blitzes=0; passVsMan=(New-SplitAccumulator); passVsZone=(New-SplitAccumulator); vs43Pass=(New-SplitAccumulator); vs43Run=(New-SplitAccumulator); vs34Pass=(New-SplitAccumulator); vs34Run=(New-SplitAccumulator) }
  }
  return $schemeTotals[$normalized]
}
foreach ($team in $teamTotals.Keys) { [void](Get-SchemeTotal $team) }

foreach ($row in $teamStats) {
  $team = Normalize-Team $row.team; $opponent = Normalize-Team $row.opponent_team; $front = $baseFronts[$opponent]
  if ($front -notin @('4-3','3-4')) { continue }
  $target = Get-SchemeTotal $team
  $pass = if ($front -eq '4-3') { $target.vs43Pass } else { $target.vs34Pass }
  $run = if ($front -eq '4-3') { $target.vs43Run } else { $target.vs34Run }
  $pass.plays += (As-Number $row.attempts) + (As-Number $row.sacks_suffered); $pass.yards += As-Number $row.passing_yards; $pass.epa += As-Number $row.passing_epa; $pass.sacks += As-Number $row.sacks_suffered; $pass.successes += As-Number $row.passing_first_downs
  $run.plays += As-Number $row.carries; $run.yards += As-Number $row.rushing_yards; $run.epa += As-Number $row.rushing_epa; $run.successes += As-Number $row.rushing_first_downs
}

$participationFile = [IO.Path]::GetTempFileName()
$ftnFile = [IO.Path]::GetTempFileName()
$pbpFile = [IO.Path]::GetTempFileName()
$playSchemes = @{}
try {
  Invoke-WebRequest -Uri $participationUri -OutFile $participationFile -UseBasicParsing
  $stream = [IO.File]::OpenRead($participationFile)
  Read-CsvStream $stream {
    param($fields,$index)
    $gameId = $fields[$index['nflverse_game_id']]; $playId = $fields[$index['play_id']]; $offense = Normalize-Team $fields[$index['possession_team']]
    $parts = $gameId.Split('_'); if ($parts.Length -lt 4) { return }
    $awayTeam = Normalize-Team $parts[2]; $homeTeam = Normalize-Team $parts[3]; $defense = if ($offense -eq $awayTeam) { $homeTeam } else { $awayTeam }
    $manZone = [string]$fields[$index['defense_man_zone_type']]; $pressure = [string]$fields[$index['was_pressure']]
    $type = if ($manZone -match '(?i)man') { 'man' } elseif ($manZone -match '(?i)zone') { 'zone' } else { '' }
    $target = Get-SchemeTotal $defense
    if ($type) { $target.coveragePlays += 1; $target[$type] += 1 }
    if ($pressure -ne '') { $target.pressureRows += 1; if ($pressure -match '^(?i:true|1|yes)$') { $target.pressures += 1 } }
    $playSchemes["$gameId|$playId"] = [ordered]@{ offense=$offense; defense=$defense; type=$type }
  }
  $stream.Dispose()

  Invoke-WebRequest -Uri $ftnUri -OutFile $ftnFile -UseBasicParsing
  $stream = [IO.File]::OpenRead($ftnFile)
  Read-CsvStream $stream {
    param($fields,$index)
    $key = "$($fields[$index['nflverse_game_id']])|$($fields[$index['nflverse_play_id']])"
    $scheme = $playSchemes[$key]; if (-not $scheme) { return }
    $blitzers = [string]$fields[$index['n_blitzers']]; $rushers = [string]$fields[$index['n_pass_rushers']]; if ($blitzers -eq '' -or $rushers -eq '' -or (As-Number $rushers) -lt 1) { return }
    $target = Get-SchemeTotal $scheme.defense; $target.blitzRows += 1; if ((As-Number $blitzers) -gt 0) { $target.blitzes += 1 }
  }
  $stream.Dispose()

  Invoke-WebRequest -Uri $pbpUri -OutFile $pbpFile -UseBasicParsing
  $fileStream = [IO.File]::OpenRead($pbpFile); $gzip = [IO.Compression.GZipStream]::new($fileStream,[IO.Compression.CompressionMode]::Decompress)
  Read-CsvStream $gzip {
    param($fields,$index)
    $key = "$($fields[$index['game_id']])|$($fields[$index['play_id']])"
    $scheme = $playSchemes[$key]; if (-not $scheme -or -not $scheme.type) { return }
    $dropback = if ($index.ContainsKey('qb_dropback')) { As-Number $fields[$index['qb_dropback']] } else { As-Number $fields[$index['pass']] }
    if ($dropback -lt 1) { return }
    $target = Get-SchemeTotal $scheme.offense; $split = if ($scheme.type -eq 'man') { $target.passVsMan } else { $target.passVsZone }
    Add-Split $split $fields[$index['success']] $fields[$index['yards_gained']] $fields[$index['epa']] $fields[$index['sack']]
  }
  $gzip.Dispose(); $fileStream.Dispose()
} finally {
  foreach ($file in @($participationFile,$ftnFile,$pbpFile)) { if (Test-Path -LiteralPath $file) { Remove-Item -LiteralPath $file -Force } }
}

$teamSchemes = foreach ($total in $schemeTotals.Values) {
  [pscustomobject][ordered]@{
    team=$total.team; baseFront=$baseFronts[$total.team]
    coveragePlays=$total.coveragePlays; defenseManRate=$(if($total.coveragePlays){$total.man/$total.coveragePlays}else{$null}); defenseZoneRate=$(if($total.coveragePlays){$total.zone/$total.coveragePlays}else{$null})
    pressurePlays=$total.pressureRows; pressureRate=$(if($total.pressureRows){$total.pressures/$total.pressureRows}else{$null}); blitzPlays=$total.blitzRows; blitzRate=$(if($total.blitzRows){$total.blitzes/$total.blitzRows}else{$null})
    passVsMan=(Finish-Split $total.passVsMan); passVsZone=(Finish-Split $total.passVsZone)
    vs43=[ordered]@{ pass=(Finish-Split $total.vs43Pass); run=(Finish-Split $total.vs43Run) }
    vs34=[ordered]@{ pass=(Finish-Split $total.vs34Pass); run=(Finish-Split $total.vs34Run) }
  }
}

$snapshot = [ordered]@{
  generatedAt = [DateTime]::UtcNow.ToString('o')
  evidenceSeason = $EvidenceSeason
  rosterSeason = $RosterSeason
  evidence = @($evidence)
  weekly = @($weekly)
  depth = @($depth)
  teamUnits = @($teamUnits)
  teamSchemes = @($teamSchemes)
  source = 'nflverse weekly player/team stats, PFR snap counts, weekly rosters, depth charts, FTN charting, participation, and play-by-play'
}

$json = $snapshot | ConvertTo-Json -Depth 8 -Compress
$output = "window.NFL_EVIDENCE_SNAPSHOT=$json;"
[IO.File]::WriteAllText((Join-Path $workspace 'nfl-evidence-snapshot.js'), $output, [Text.UTF8Encoding]::new($false))
Write-Output "Wrote nfl-evidence-snapshot.js: $($evidence.Count) players, $($weekly.Count) roster rows, $($depth.Count) latest depth rows, $($teamUnits.Count) team units, $($teamSchemes.Count) team schemes."
