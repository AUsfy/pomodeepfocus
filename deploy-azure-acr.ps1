# Pomodoro Timer Azure Container App Deployment Script (Cloud Build)
# This script deploys the Pomodoro Timer to Azure Container Apps using ACR build

# Configuration variables
$ResourceGroup = "rg-pomodoro-timer"
$Location = "East US"
$ContainerRegistryName = "acrpomodorotimer"
$AppName = "app-pomodoro-timer"
$EnvironmentName = "env-pomodoro-timer"
$ImageName = "pomodoro-timer"

try {
    Write-Host "Starting Pomodoro Timer deployment to Azure (using cloud build)..." -ForegroundColor Green

    # Get registry credentials (registry should already exist from previous run)
    $RegistryServer = az acr show --name $ContainerRegistryName --resource-group $ResourceGroup --query "loginServer" --output tsv
    
    if (-not $RegistryServer) {
        Write-Host "Creating Container Registry..." -ForegroundColor Yellow
        az acr create --resource-group $ResourceGroup --name $ContainerRegistryName --sku Basic --admin-enabled true
        $RegistryServer = az acr show --name $ContainerRegistryName --resource-group $ResourceGroup --query "loginServer" --output tsv
    }
    
    # Build image using Azure Container Registry (cloud build)
    Write-Host "Building image in Azure Container Registry..." -ForegroundColor Yellow
    az acr build --registry $ContainerRegistryName --image "$ImageName`:latest" .

    # Get registry credentials
    $RegistryUsername = az acr credential show --name $ContainerRegistryName --resource-group $ResourceGroup --query "username" --output tsv
    $RegistryPassword = az acr credential show --name $ContainerRegistryName --resource-group $ResourceGroup --query "passwords[0].value" --output tsv

    # Check if Container Apps Environment exists
    $EnvExists = az containerapp env show --name $EnvironmentName --resource-group $ResourceGroup --query "name" --output tsv 2>$null
    
    if (-not $EnvExists) {
        Write-Host "Creating Container Apps Environment..." -ForegroundColor Yellow
        az containerapp env create `
            --name $EnvironmentName `
            --resource-group $ResourceGroup `
            --location $Location
    }

    # Check if Container App exists, create or update
    $AppExists = az containerapp show --name $AppName --resource-group $ResourceGroup --query "name" --output tsv 2>$null
    
    if (-not $AppExists) {
        Write-Host "Creating Container App..." -ForegroundColor Yellow
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
    } else {
        Write-Host "Updating existing Container App..." -ForegroundColor Yellow
        az containerapp update `
            --name $AppName `
            --resource-group $ResourceGroup `
            --image "$RegistryServer/$ImageName`:latest"
    }

    # Get the app URL
    $AppUrl = az containerapp show --name $AppName --resource-group $ResourceGroup --query "properties.configuration.ingress.fqdn" --output tsv

    Write-Host "Deployment completed!" -ForegroundColor Green
    Write-Host "Your Pomodoro Timer is available at: https://$AppUrl" -ForegroundColor Green
    Write-Host "This should match your domain: https://pomodeepfocus.online" -ForegroundColor Cyan

    # Display resource information
    Write-Host "Resource summary:" -ForegroundColor Magenta
    Write-Host "   - Resource Group: $ResourceGroup" -ForegroundColor White
    Write-Host "   - Container Registry: $ContainerRegistryName" -ForegroundColor White
    Write-Host "   - Container App: $AppName" -ForegroundColor White

} catch {
    Write-Host "Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
