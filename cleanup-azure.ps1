# Cleanup script for Azure resources
# Use this to delete all resources and stop billing

param(
    [string]$ResourceGroup = "rg-pomo-timer",
    [switch]$Force
)

Write-Host "🧹 Azure Resource Cleanup for Pomodoro Timer" -ForegroundColor Red

if (-not $Force) {
    $confirm = Read-Host "Are you sure you want to delete resource group '$ResourceGroup' and ALL its resources? (yes/no)"
    if ($confirm -ne "yes") {
        Write-Host "❌ Cleanup cancelled" -ForegroundColor Yellow
        exit 0
    }
}

try {
    Write-Host "🗑️ Deleting resource group: $ResourceGroup..." -ForegroundColor Yellow
    az group delete --name $ResourceGroup --yes --no-wait
    
    Write-Host "✅ Cleanup initiated! Resources are being deleted in the background." -ForegroundColor Green
    Write-Host "💰 This will stop all billing for these resources." -ForegroundColor Green
    Write-Host "📊 You can monitor deletion progress in the Azure portal." -ForegroundColor Cyan
} catch {
    Write-Host "❌ Cleanup failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}