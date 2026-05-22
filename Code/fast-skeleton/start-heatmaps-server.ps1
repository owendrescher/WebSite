$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Port = $null
$Listener = $null
foreach ($CandidatePort in 8765..8799) {
  try {
    $CandidateListener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $CandidatePort)
    $CandidateListener.Start()
    $Listener = $CandidateListener
    $Port = $CandidatePort
    break
  } catch {
    if ($CandidateListener) {
      try { $CandidateListener.Stop() } catch {}
    }
  }
}

if (-not $Listener) {
  throw 'Could not start a localhost server on ports 8765-8799.'
}

$Url = "http://localhost:$Port/player-heatmaps.html"
Set-Content -LiteralPath (Join-Path $Root 'player-heatmaps-url.txt') -Value $Url -Encoding ASCII
Write-Host "Player heatmaps server running at $Url"
Write-Host "Press Ctrl+C to stop."

function Get-ContentType($Path) {
  switch ([IO.Path]::GetExtension($Path).ToLowerInvariant()) {
    '.html' { 'text/html; charset=utf-8' }
    '.css' { 'text/css; charset=utf-8' }
    '.js' { 'application/javascript; charset=utf-8' }
    '.csv' { 'text/csv; charset=utf-8' }
    '.png' { 'image/png' }
    '.ico' { 'image/x-icon' }
    default { 'application/octet-stream' }
  }
}

function Send-Response($Stream, [int]$Status, [string]$Type, [byte[]]$Body) {
  $Reason = if ($Status -eq 200) { 'OK' } elseif ($Status -eq 404) { 'Not Found' } else { 'Error' }
  $Header = "HTTP/1.1 $Status $Reason`r`nContent-Type: $Type`r`nContent-Length: $($Body.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
  $HeaderBytes = [Text.Encoding]::ASCII.GetBytes($Header)
  $Stream.Write($HeaderBytes, 0, $HeaderBytes.Length)
  if ($Body.Length) { $Stream.Write($Body, 0, $Body.Length) }
}

try {
  while ($true) {
    $Client = $Listener.AcceptTcpClient()
    try {
      $Stream = $Client.GetStream()
      $Buffer = New-Object byte[] 1048576
      $Read = $Stream.Read($Buffer, 0, $Buffer.Length)
      if ($Read -le 0) { continue }
      $RequestText = [Text.Encoding]::UTF8.GetString($Buffer, 0, $Read)
      $HeaderEnd = $RequestText.IndexOf("`r`n`r`n")
      if ($HeaderEnd -lt 0) { continue }
      $HeaderText = $RequestText.Substring(0, $HeaderEnd)
      $RequestLine = ($HeaderText -split "`r`n")[0]
      $Parts = $RequestLine -split ' '
      $Method = $Parts[0]
      $RawPath = $Parts[1]
      $PathOnly = ([Uri]$("http://localhost$RawPath")).AbsolutePath
      $Path = [Uri]::UnescapeDataString($PathOnly.TrimStart('/'))

      if ($Method -eq 'POST' -and $Path -eq 'api/save-season-csv') {
        $LengthMatch = [regex]::Match($HeaderText, '(?im)^Content-Length:\s*(\d+)\s*$')
        $ContentLength = if ($LengthMatch.Success) { [int]$LengthMatch.Groups[1].Value } else { 0 }
        $BodyStart = $HeaderEnd + 4
        $BodyBytes = New-Object byte[] $ContentLength
        $Already = [Math]::Max(0, $Read - $BodyStart)
        if ($Already -gt 0) {
          [Array]::Copy($Buffer, $BodyStart, $BodyBytes, 0, [Math]::Min($Already, $ContentLength))
        }
        $Offset = [Math]::Min($Already, $ContentLength)
        while ($Offset -lt $ContentLength) {
          $Chunk = $Stream.Read($BodyBytes, $Offset, $ContentLength - $Offset)
          if ($Chunk -le 0) { break }
          $Offset += $Chunk
        }
        [IO.File]::WriteAllBytes((Join-Path $Root 'season_data_0401-0520.csv'), $BodyBytes)
        Send-Response $Stream 200 'application/json; charset=utf-8' ([Text.Encoding]::UTF8.GetBytes('{"ok":true}'))
        continue
      }

      if ([string]::IsNullOrWhiteSpace($Path)) { $Path = 'player-heatmaps.html' }
      $FullPath = [IO.Path]::GetFullPath([IO.Path]::Combine($Root, $Path))
      if (-not $FullPath.StartsWith($Root) -or -not [IO.File]::Exists($FullPath)) {
        Send-Response $Stream 404 'text/plain; charset=utf-8' ([Text.Encoding]::UTF8.GetBytes('Not found'))
        continue
      }
      Send-Response $Stream 200 (Get-ContentType $FullPath) ([IO.File]::ReadAllBytes($FullPath))
    } catch {
      try { Send-Response $Stream 500 'text/plain; charset=utf-8' ([Text.Encoding]::UTF8.GetBytes($_.Exception.Message)) } catch {}
    } finally {
      $Client.Close()
    }
  }
} finally {
  $Listener.Stop()
}
