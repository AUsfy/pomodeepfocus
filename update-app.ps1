# Update existing Pomodoro Timer Container App
# This script only updates the existing container app with new image

# Configuration variables (should match existing resources)
$AppResourceGroup = "rg-pomo-timer"
$RegistryResourceGroup = "rg-pomo-timer"
$ContainerRegistryName = "pomoregistry1752059177"
$AppName = "pomo-timer"
$ImageName = "pomodoro-timer"

try {
    Write-Host "Updating existing Pomodoro Timer container app..." -ForegroundColor Green

    # Get existing registry server
    $RegistryServer = az acr show --name $ContainerRegistryName --resource-group $RegistryResourceGroup --query "loginServer" --output tsv
    
    if (-not $RegistryServer) {
        Write-Host "Error: Container registry not found. Please check if resources exist." -ForegroundColor Red
        exit 1
    }

    Write-Host "Found registry: $RegistryServer" -ForegroundColor Yellow

    # Build new image using Azure Container Registry (cloud build)
    Write-Host "Building updated image in Azure Container Registry..." -ForegroundColor Yellow
    az acr build --registry $ContainerRegistryName --image "$ImageName`:latest" .

    # Update the existing container app with new image
    Write-Host "Updating Container App with new image..." -ForegroundColor Yellow
    az containerapp update `
        --name $AppName `
        --resource-group $AppResourceGroup `
        --image "$RegistryServer/$ImageName`:latest"

    # Get the app URL
    $AppUrl = az containerapp show --name $AppName --resource-group $AppResourceGroup --query "properties.configuration.ingress.fqdn" --output tsv

    Write-Host "Update completed!" -ForegroundColor Green
    Write-Host "Your updated Pomodoro Timer is available at: https://$AppUrl" -ForegroundColor Green
    Write-Host "Domain mapping: https://pomodeepfocus.online" -ForegroundColor Cyan

    Write-Host "SEO improvements deployed:" -ForegroundColor Magenta
    Write-Host "   - Updated sitemap.xml with pomodeepfocus.online domain" -ForegroundColor White
    Write-Host "   - Enhanced robots.txt for search engines" -ForegroundColor White
    Write-Host "   - Comprehensive meta tags and Open Graph data" -ForegroundColor White
    Write-Host "   - PWA manifest for mobile experience" -ForegroundColor White
    Write-Host "   - Structured data for better search visibility" -ForegroundColor White

} catch {
    Write-Host "Update failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
