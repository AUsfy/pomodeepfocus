# Pomodoro Timer Azure Container App Deployment Script
# This script deploys the Pomodoro Timer to Azure Container Apps with minimal cost configuration

# Configuration variables
$ResourceGroup = "rg-pomodoro-timer"
$Location = "East US"
$ContainerRegistryName = "acrpomodorotimer"
$AppName = "app-pomodoro-timer"
$EnvironmentName = "env-pomodoro-timer"
$ImageName = "pomodoro-timer"

try {
    Write-Host "Starting Pomodoro Timer deployment to Azure..." -ForegroundColor Green

    # Step 1: Create Resource Group
    Write-Host "Creating Resource Group..." -ForegroundColor Yellow
    az group create --name $ResourceGroup --location $Location

    # Step 2: Create Container Registry (Basic SKU for cost savings)
    Write-Host "Creating Container Registry..." -ForegroundColor Yellow
    az acr create --resource-group $ResourceGroup --name $ContainerRegistryName --sku Basic --admin-enabled true

    # Step 3: Build and push Docker image
    Write-Host "Building and pushing Docker image..." -ForegroundColor Yellow
    
    # Get registry credentials
    $RegistryServer = az acr show --name $ContainerRegistryName --resource-group $ResourceGroup --query "loginServer" --output tsv
    $RegistryUsername = az acr credential show --name $ContainerRegistryName --resource-group $ResourceGroup --query "username" --output tsv
    $RegistryPassword = az acr credential show --name $ContainerRegistryName --resource-group $ResourceGroup --query "passwords[0].value" --output tsv

    # Build image
    docker build -t "$RegistryServer/$ImageName`:latest" .
    
    # Login to registry and push
    docker login $RegistryServer --username $RegistryUsername --password $RegistryPassword
    docker push "$RegistryServer/$ImageName`:latest"

    # Step 4: Create Container Apps Environment
    Write-Host "Creating Container Apps Environment..." -ForegroundColor Yellow
    az containerapp env create `
        --name $EnvironmentName `
        --resource-group $ResourceGroup `
        --location $Location

    # Step 5: Deploy Container App (minimal resources)
    Write-Host "Deploying Container App..." -ForegroundColor Yellow
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

    Write-Host "Deployment completed!" -ForegroundColor Green
    Write-Host "Your Pomodoro Timer is available at: https://$AppUrl" -ForegroundColor Green

    # Display cost-saving information
    Write-Host "Cost-saving features enabled:" -ForegroundColor Magenta
    Write-Host "   - Basic SKU Container Registry" -ForegroundColor White
    Write-Host "   - Minimal CPU and memory configuration" -ForegroundColor White
    Write-Host "   - Scale to zero (min-replicas: 0)" -ForegroundColor White
    Write-Host "   - Auto-scale up to 2 replicas max" -ForegroundColor White

    Write-Host "Resource summary:" -ForegroundColor Magenta
    Write-Host "   - Resource Group: $ResourceGroup" -ForegroundColor White
    Write-Host "   - Container Registry: $ContainerRegistryName" -ForegroundColor White
    Write-Host "   - Container App: $AppName" -ForegroundColor White

    Write-Host "To update the app, run:" -ForegroundColor Magenta
    Write-Host "   az containerapp update --name $AppName --resource-group $ResourceGroup --image $RegistryServer/$ImageName`:latest" -ForegroundColor Gray

} catch {
    Write-Host "Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
