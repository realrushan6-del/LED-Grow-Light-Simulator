$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
$outputDirectory = Join-Path $projectRoot 'dist'
$assets = @('index.html', 'grow-light.css', 'grow-light.js')

New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null

foreach ($asset in $assets) {
    Copy-Item -LiteralPath (Join-Path $projectRoot $asset) `
        -Destination (Join-Path $outputDirectory $asset) `
        -Force
}

Write-Output "Build complete: $outputDirectory"
