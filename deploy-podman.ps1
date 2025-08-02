# Deploy Pomodoro Timer using Podman local build
# This script builds the image locally with Podman and deploys directly to Container App

# Configuration variables
$AppResourceGroup = "rg-pomo-timer"
$AppName = "pomo-timer"
$ImageName = "pomodoro-timer"
$ImageTag = "latest"
$LocalImageName = "$ImageName`:$ImageTag"

# Deploy Pomodoro Timer directly to Container App
# This script deploys to Container App using Azure Container Registry cloud build (no WSL required)

# Configuration variables
$AppResourceGroup = "rg-pomo-timer"
$RegistryResourceGroup = "rg-pomo-timer"
$ContainerRegistryName = "pomoregistry1752059177"
$AppName = "pomo-timer"
$ImageName = "pomodoro-timer"

try {
    Write-Host "Deploying Pomodoro Timer to Container App..." -ForegroundColor Green

    # Get registry server
    Write-Host "Getting registry server information..." -ForegroundColor Yellow
    $RegistryServer = az acr show --name $ContainerRegistryName --resource-group $RegistryResourceGroup --query "loginServer" --output tsv
    
    if (-not $RegistryServer) {
        Write-Host "Error: Container registry not found. Please check if resources exist." -ForegroundColor Red
        exit 1
    }

    Write-Host "Found registry: $RegistryServer" -ForegroundColor Yellow

    # Build image using Azure Container Registry (cloud build - no WSL required)
    Write-Host "Building image in Azure Container Registry (cloud build)..." -ForegroundColor Yellow
    az acr build --registry $ContainerRegistryName --image "$ImageName`:latest" .

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to build image in ACR" -ForegroundColor Red
        exit 1
    }

    # Update the existing container app with new image
    Write-Host "Updating Container App with new image..." -ForegroundColor Yellow
    az containerapp update `
        --name $AppName `
        --resource-group $AppResourceGroup `
        --image "$RegistryServer/$ImageName`:latest"

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to update container app" -ForegroundColor Red
        exit 1
    }

    # Get the app URL
    $AppUrl = az containerapp show --name $AppName --resource-group $AppResourceGroup --query "properties.configuration.ingress.fqdn" --output tsv

    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    Write-Host "Your updated Pomodoro Timer is available at: https://$AppUrl" -ForegroundColor Green
    Write-Host "Domain mapping: https://pomodeepfocus.online" -ForegroundColor Cyan

    Write-Host "SEO improvements deployed:" -ForegroundColor Magenta
    Write-Host "   ✓ FAQ page with structured data for rich snippets" -ForegroundColor White
    Write-Host "   ✓ About page with comprehensive content" -ForegroundColor White
    Write-Host "   ✓ Help page with detailed guides" -ForegroundColor White
    Write-Host "   ✓ Enhanced sitemap.xml and robots.txt" -ForegroundColor White
    Write-Host "   ✓ Comprehensive meta tags and Open Graph data" -ForegroundColor White
    Write-Host "   ✓ Improved PWA manifest and humans.txt" -ForegroundColor White

} catch {
    Write-Host "Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
