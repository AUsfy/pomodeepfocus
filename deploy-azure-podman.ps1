# Azure Container Apps Deployment Script for Pomodoro Timer (PowerShell)
# This script creates minimal resources for cost savings

param(
    [string]$AppName = "pomo-timer",
    [string]$ResourceGroup = "rg-pomo-timer", 
    [string]$Location = "eastus",
    [string]$EnvironmentName = "pomo-env",
    [string]$RegistryServer = "docker.io/tjoker",
    [string]$ImageName          = "pomofocus"

)

$ErrorActionPreference = "Stop"

Write-Host "🍅 Deploying Pomodoro Timer to Azure Container Apps..." -ForegroundColor Green
Write-Host "App Name: $AppName" -ForegroundColor Cyan
Write-Host "Resource Group: $ResourceGroup" -ForegroundColor Cyan
Write-Host "Location: $Location" -ForegroundColor Cyan

try {
    # Build Docker image using Podman
    Write-Host "🐳 Building Docker image with Podman..." -ForegroundColor Yellow
    podman build -t "$RegistryServer/$ImageName`:latest" .

    # Push image to registry
    Write-Host "🚀 Pushing image to registry..." -ForegroundColor Yellow
    podman push "$RegistryServer/$ImageName`:latest"
    # Update Container App with new image
    Write-Host "🔄 Updating Container App with new image..." -ForegroundColor Yellow
    az containerapp update `
        --name $AppName `
        --resource-group $ResourceGroup `
        --image "$RegistryServer/$ImageName`:latest"
    # Get the app URL
    $AppUrl = az containerapp show --name $AppName --resource-group $ResourceGroup --query "properties.configuration.ingress.fqdn" --output tsv

    Write-Host "`nDeployment completed!" -ForegroundColor Green
    Write-Host "Your Pomodoro Timer is available at: https://$AppUrl" -ForegroundColor Green

    # Display cost-saving information
    Write-Host "`nCost-saving features enabled:" -ForegroundColor Magenta
    Write-Host "   - Basic SKU Container Registry" -ForegroundColor White
    Write-Host "   - Minimal CPU and memory configuration" -ForegroundColor White
    Write-Host "   - Scale to zero (min-replicas: 0)" -ForegroundColor White
    Write-Host "   - Auto-scale up to 2 replicas max" -ForegroundColor White

    Write-Host "`nResource summary:" -ForegroundColor Magenta
    Write-Host "   - Resource Group: $ResourceGroup" -ForegroundColor White
    Write-Host "   - Container Registry: $ContainerRegistryName" -ForegroundColor White
    Write-Host "   - Container App: $AppName" -ForegroundColor White
    Write-Host "   - Environment: $EnvironmentName" -ForegroundColor White

    Write-Host "`nTo update the app, run:" -ForegroundColor Magenta
    Write-Host "   az acr build --registry $ContainerRegistryName --image $ImageName`:latest ." -ForegroundColor Gray
    Write-Host "   az containerapp update --name $AppName --resource-group $ResourceGroup --image $RegistryServer/$ImageName`:latest" -ForegroundColor Gray

# Catch block
} catch {
    Write-Host "Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}