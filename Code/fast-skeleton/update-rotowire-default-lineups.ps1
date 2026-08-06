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

function Get-DefaultLineup([string]$html, [string]$hand) {
  $escapedHand = [regex]::Escape($hand)
  $section = [regex]::Match(
    $html,
    "Default\s+vs\.\s+$escapedHand\s*</div>\s*<ol[^>]*>(?<list>[\s\S]*?)</ol>",
    [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
  )
  if (-not $section.Success) { return @() }

  $names = @()
  $links = [regex]::Matches(
    $section.Groups['list'].Value,
    '<a\s+[^>]*href="/baseball/player/[^\"]+"[^>]*>(?<name>[\s\S]*?)</a>',
    [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
  )
  foreach ($link in $links) {
    $name = [System.Net.WebUtility]::HtmlDecode([regex]::Replace($link.Groups['name'].Value, '<[^>]+>', '')).Trim()
    if (-not [string]::IsNullOrWhiteSpace($name)) { $names += $name }
  }
  if ($names.Count -ne 9 -or ($names | Select-Object -Unique).Count -ne 9) { return @() }
  return $names
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
  $url = "https://www.rotowire.com/baseball/batting-orders.php?team=$team"
  try {
    $html = [string](Invoke-RestMethod -Uri $url -TimeoutSec 20)
    $rhp = Get-DefaultLineup $html "RHP"
    $lhp = Get-DefaultLineup $html "LHP"
    if ($rhp.Count -ne 9 -and $previous.ContainsKey($team)) { $rhp = @($previous[$team].RHP) }
    if ($lhp.Count -ne 9 -and $previous.ContainsKey($team)) { $lhp = @($previous[$team].LHP) }
    if ($rhp.Count -ne 9 -or $lhp.Count -ne 9) {
      throw "Could not resolve both RHP and LHP lineups for $team"
    }
    $payload[$team] = [ordered]@{ RHP = $rhp; LHP = $lhp }
    $sources[$team] = [ordered]@{
      url = $url
      rhp = "current RotoWire default vs RHP"
      lhp = "current RotoWire default vs LHP"
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

$compressed = $payload | ConvertTo-Json -Depth 5 -Compress
$previousCompressed = if ($null -ne $previousRaw) { $previousRaw | ConvertTo-Json -Depth 5 -Compress } else { "" }
if ($compressed -eq $previousCompressed) {
  Write-Output (@{ changed = $false; teams = $payload.Keys.Count; lineups = $payload.Keys.Count * 2; slots = $payload.Keys.Count * 18 } | ConvertTo-Json)
  return
}

$json = $payload | ConvertTo-Json -Depth 5
Set-Content -LiteralPath $SourcePath -Value $json -Encoding UTF8

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
  note = "Static RotoWire fallback refreshed from each team's current Default vs. RHP and Default vs. LHP batting-order sections; previous seed preserved only if a hand could not be resolved."
  sourcePattern = "https://www.rotowire.com/baseball/batting-orders.php?team={TEAM}"
  teams = $sources
}
Set-Content -LiteralPath $ProofPath -Value ($proof | ConvertTo-Json -Depth 6) -Encoding UTF8

Write-Output (@{
  changed = $true
  generatedAt = $generatedAt
  teams = $payload.Keys.Count
  lineups = $payload.Keys.Count * 2
  slots = $payload.Keys.Count * 18
} | ConvertTo-Json)
