param(
  [string]$Time = '10:00'
)

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Launcher = Join-Path $Root 'open-player-heatmaps.cmd'
$TaskName = 'PlayerHeatmapsDailyUpdate'

if (-not (Test-Path -LiteralPath $Launcher)) {
  throw "Missing launcher: $Launcher"
}

$Action = New-ScheduledTaskAction -Execute $Launcher
$Trigger = New-ScheduledTaskTrigger -Daily -At $Time
$Principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel LeastPrivilege
$Task = New-ScheduledTask -Action $Action -Trigger $Trigger -Principal $Principal -Description 'Opens the player heatmaps page so it can append missing prediction rows through yesterday.'

Register-ScheduledTask -TaskName $TaskName -InputObject $Task -Force | Out-Null
Write-Host "Installed daily heatmaps update task '$TaskName' at $Time."
Write-Host "It opens: $Launcher"
