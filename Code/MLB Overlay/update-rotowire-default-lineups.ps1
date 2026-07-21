param(
  [string]$SourcePath = "rotowire-current-defaults.json",
  [string]$OutputPath = "rotowire-default-lineups.js",
  [string]$ProofPath = "rotowire-update-proof.json"
)

$ErrorActionPreference = "Stop"

$teams = @(
  "ARI","ATH","ATL","BAL","BOS","CHC","CIN","CLE","COL","CWS",
  "DET","HOU","KC","LAA","LAD","MIA","MIL","MIN","NYM","NYY",
  "PHI","PIT","SD","SEA","SF","STL","TB","TEX","TOR","WSH"
)

function Get-LineupNames($row) {
  $names = @()
  foreach ($field in @("playerone","playertwo","playerthree","playerfour","playerfive","playersix","playerseven","playereight","playernine")) {
    $name = [string]($row.$field)
    if ([string]::IsNullOrWhiteSpace($name)) { return @() }
    $names += $name.Trim()
  }
  if (($names | Select-Object -Unique).Count -ne 9) { return @() }
  return $names
}

function Get-HandLineup($rows, $hand) {
  foreach ($row in @($rows)) {
    $rowHand = [string]($row.opposingPitcherHandness)
    if ($rowHand -ne $hand) { continue }
    $lineup = Get-LineupNames $row
    if ($lineup.Count -eq 9) { return $lineup }
  }
  return @()
}

$previous = @{}
if (Test-Path -LiteralPath $SourcePath) {
  $previousRaw = Get-Content -LiteralPath $SourcePath -Raw | ConvertFrom-Json
  foreach ($team in $previousRaw.PSObject.Properties.Name) {
    $previous[$team] = @{
      RHP = @($previousRaw.$team.RHP)
      LHP = @($previousRaw.$team.LHP)
    }
  }
}

$payload = [ordered]@{}
$sources = [ordered]@{}
foreach ($team in $teams) {
  $url = "https://www.rotowire.com/baseball/tables/batting-order-data.php?team=$team"
  try {
    $rows = Invoke-RestMethod -Uri $url -TimeoutSec 20
    $rhp = Get-HandLineup $rows "R"
    $lhp = Get-HandLineup $rows "L"
    if ($rhp.Count -ne 9 -and $previous.ContainsKey($team)) { $rhp = @($previous[$team].RHP) }
    if ($lhp.Count -ne 9 -and $previous.ContainsKey($team)) { $lhp = @($previous[$team].LHP) }
    if ($rhp.Count -ne 9 -or $lhp.Count -ne 9) {
      throw "Could not resolve both RHP and LHP lineups for $team"
    }
    $payload[$team] = [ordered]@{ RHP = $rhp; LHP = $lhp }
    $sources[$team] = [ordered]@{
      url = $url
      rows = @($rows).Count
      rhp = "latest actual lineup vs RHP"
      lhp = "latest actual lineup vs LHP"
    }
  } catch {
    if (-not $previous.ContainsKey($team)) { throw }
    $payload[$team] = [ordered]@{ RHP = @($previous[$team].RHP); LHP = @($previous[$team].LHP) }
    $sources[$team] = [ordered]@{ url = $url; error = $_.Exception.Message; fallback = "preserved previous seed" }
  }
}

if ($payload.Keys.Count -ne 30) { throw "Expected 30 teams, got $($payload.Keys.Count)" }
foreach ($team in $teams) {
  foreach ($hand in @("RHP","LHP")) {
    $names = @($payload[$team][$hand])
    if ($names.Count -ne 9) { throw "$team $hand must have 9 hitters" }
    if (($names | Select-Object -Unique).Count -ne 9) { throw "$team $hand has duplicate hitters" }
  }
}

$json = $payload | ConvertTo-Json -Depth 5
Set-Content -LiteralPath $SourcePath -Value $json -Encoding UTF8

$compressed = $payload | ConvertTo-Json -Depth 5 -Compress
$generatedAt = (Get-Date).ToUniversalTime().ToString("o")
$js = @(
  "// Generated from current RotoWire recent batting orders by opposing pitcher hand.",
  "// Generated at $generatedAt.",
  "window.ROTOWIRE_DEFAULT_LINEUP_SEEDS = $compressed;",
  ""
) -join "`n"
Set-Content -LiteralPath $OutputPath -Value $js -Encoding UTF8

$proof = [ordered]@{
  generatedAt = $generatedAt
  note = "Static RotoWire fallback refreshed from RotoWire batting-order table endpoint. Each hand uses the latest actual lineup against that opposing pitcher hand; previous seed preserved only if a hand could not be resolved."
  sourcePattern = "https://www.rotowire.com/baseball/tables/batting-order-data.php?team={TEAM}"
  teams = $sources
}
Set-Content -LiteralPath $ProofPath -Value ($proof | ConvertTo-Json -Depth 6) -Encoding UTF8

Write-Output (@{
  generatedAt = $generatedAt
  teams = $payload.Keys.Count
  lineups = $payload.Keys.Count * 2
  slots = $payload.Keys.Count * 18
} | ConvertTo-Json)
