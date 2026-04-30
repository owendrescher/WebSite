[CmdletBinding()]
param(
    [int]$Port = 8974,
    [string]$TargetLanguage = "en",
    [ValidateSet("googleweb", "none", "libretranslate")]
    [string]$TranslationProvider = "googleweb"
)

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
powershell -ExecutionPolicy Bypass -File (Join-Path $projectRoot "dual-lyrics-server.ps1") `
    -Port $Port `
    -TargetLanguage $TargetLanguage `
    -TranslationProvider $TranslationProvider `
    -OpenBrowser
