# Azure Container Apps Deployment Script for Pomodoro Timer (PowerShell)
# This script creates minimal resources for cost savings

param(
    [string]$AppName = "pomo-timer",
    [string]$ResourceGroup = "rg-pomo-timer", 
    [string]$Location = "eastus",
    [string]$EnvironmentName = "pomo-env"
)

$ErrorActionPreference = "Stop"

# Generate unique registry name
$ContainerRegistryName = "pomoregistry$(Get-Date -Format 'yyyyMMddHHmm')"
$ImageName = "pomodoro-timer"

Write-Host "🍅 Deploying Pomodoro Timer to Azure Container Apps..." -ForegroundColor Green
Write-Host "App Name: $AppName" -ForegroundColor Cyan
Write-Host "Resource Group: $ResourceGroup" -ForegroundColor Cyan
Write-Host "Location: $Location" -ForegroundColor Cyan

try {
    # Step 1: Create Resource Group
    Write-Host "📦 Creating resource group..." -ForegroundColor Yellow
    az group create --name $ResourceGroup --location $Location

    # Step 2: Create Azure Container Registry (minimal SKU)
    Write-Host "🐳 Creating Azure Container Registry..." -ForegroundColor Yellow
    az acr create `
        --resource-group $ResourceGroup `
        --name $ContainerRegistryName `
        --sku Basic `
        --admin-enabled true

    # Get registry credentials
    Write-Host "🔑 Getting registry credentials..." -ForegroundColor Yellow
    $RegistryServer = az acr show --name $ContainerRegistryName --resource-group $ResourceGroup --query loginServer --output tsv
    $RegistryUsername = az acr credential show --name $ContainerRegistryName --resource-group $ResourceGroup --query username --output tsv
    $RegistryPassword = az acr credential show --name $ContainerRegistryName --resource-group $ResourceGroup --query "passwords[0].value" --output tsv

    Write-Host "Registry Server: $RegistryServer" -ForegroundColor Cyan

    # Step 3: Build and push Docker image
    Write-Host "🔨 Building and pushing Docker image..." -ForegroundColor Yellow
    az acr build `
        --registry $ContainerRegistryName `
        --image "$ImageName`:latest" `
        .

    # Step 4: Create Container Apps Environment
    Write-Host "🌐 Creating Container Apps Environment..." -ForegroundColor Yellow
    az containerapp env create `
        --name $EnvironmentName `
        --resource-group $ResourceGroup `
        --location $Location

    # Step 5: Deploy Container App (minimal resources)
    Write-Host "🚀 Deploying Container App..." -ForegroundColor Yellow
    az containerapp create `
        --name $AppName `
        --resource-group $ResourceGroup `
        --environment $EnvironmentName `
        --image "$RegistryServer/$ImageName`:latest" `
        --registry-server $RegistryServer `
        --registry-username $RegistryUsername `
        --registry-password $RegistryPassword `
        --target-port 80 `
        --ingress external `
        --cpu 0.25 `
        --memory 0.5Gi `
        --min-replicas 0 `
        --max-replicas 2

    # Get the app URL
    $AppUrl = az containerapp show --name $AppName --resource-group $ResourceGroup --query "properties.configuration.ingress.fqdn" --output tsv

    Write-Host "`n✅ Deployment completed!" -ForegroundColor Green
    Write-Host "🌐 Your Pomodoro Timer is available at: https://$AppUrl" -ForegroundColor Green

    # Display cost-saving information
    Write-Host "`n💰 Cost-saving features enabled:" -ForegroundColor Magenta
    Write-Host "   - Basic SKU Container Registry" -ForegroundColor White
    Write-Host "   - Minimal CPU (0.25 cores) and memory (0.5GB)" -ForegroundColor White
    Write-Host "   - Scale to zero (min-replicas: 0)" -ForegroundColor White
    Write-Host "   - Auto-scale up to 2 replicas max" -ForegroundColor White

    Write-Host "`n📊 Resource summary:" -ForegroundColor Magenta
    Write-Host "   - Resource Group: $ResourceGroup" -ForegroundColor White
    Write-Host "   - Container Registry: $ContainerRegistryName" -ForegroundColor White
    Write-Host "   - Container App: $AppName" -ForegroundColor White
    Write-Host "   - Environment: $EnvironmentName" -ForegroundColor White

    Write-Host "`n🔧 To update the app, run:" -ForegroundColor Magenta
    Write-Host "   az acr build --registry $ContainerRegistryName --image $ImageName`:latest ." -ForegroundColor Gray
    Write-Host "   az containerapp update --name $AppName --resource-group $ResourceGroup --image $RegistryServer/$ImageName`:latest" -ForegroundColor Gray

} catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}