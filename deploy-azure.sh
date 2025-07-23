#!/bin/bash

# Azure Container Apps Deployment Script for Pomodoro Timer
# This script creates minimal resources for cost savings

set -e

# Configuration - Modify these values as needed
APP_NAME="pomo-timer"
RESOURCE_GROUP="rg-pomo-timer"
LOCATION="eastus"  # Choose the cheapest region near you
ENVIRONMENT_NAME="pomo-env"
CONTAINER_REGISTRY_NAME="pomoregistry$(date +%s)"  # Unique name
IMAGE_NAME="pomodoro-timer"

echo "🍅 Deploying Pomodoro Timer to Azure Container Apps..."
echo "App Name: $APP_NAME"
echo "Resource Group: $RESOURCE_GROUP"
echo "Location: $LOCATION"

# Step 1: Create Resource Group
echo "📦 Creating resource group..."
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

# Step 2: Create Azure Container Registry (minimal SKU)
echo "🐳 Creating Azure Container Registry..."
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $CONTAINER_REGISTRY_NAME \
  --sku Basic \
  --admin-enabled true

# Get registry credentials
echo "🔑 Getting registry credentials..."
REGISTRY_SERVER=$(az acr show --name $CONTAINER_REGISTRY_NAME --resource-group $RESOURCE_GROUP --query loginServer --output tsv)
REGISTRY_USERNAME=$(az acr credential show --name $CONTAINER_REGISTRY_NAME --resource-group $RESOURCE_GROUP --query username --output tsv)
REGISTRY_PASSWORD=$(az acr credential show --name $CONTAINER_REGISTRY_NAME --resource-group $RESOURCE_GROUP --query passwords[0].value --output tsv)

echo "Registry Server: $REGISTRY_SERVER"

# Step 3: Build and push Docker image
echo "🔨 Building and pushing Docker image..."
az acr build \
  --registry $CONTAINER_REGISTRY_NAME \
  --image $IMAGE_NAME:latest \
  .

# Step 4: Create Container Apps Environment (minimal configuration)
echo "🌐 Creating Container Apps Environment..."
az containerapp env create \
  --name $ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# Step 5: Deploy Container App (minimal resources)
echo "🚀 Deploying Container App..."
az containerapp create \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT_NAME \
  --image "$REGISTRY_SERVER/$IMAGE_NAME:latest" \
  --registry-server $REGISTRY_SERVER \
  --registry-username $REGISTRY_USERNAME \
  --registry-password $REGISTRY_PASSWORD \
  --target-port 80 \
  --ingress external \
  --cpu 0.25 \
  --memory 0.5Gi \
  --min-replicas 0 \
  --max-replicas 2

# Get the app URL
echo "✅ Deployment completed!"
APP_URL=$(az containerapp show --name $APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn --output tsv)
echo "🌐 Your Pomodoro Timer is available at: https://$APP_URL"

# Display cost-saving information
echo ""
echo "💰 Cost-saving features enabled:"
echo "   - Basic SKU Container Registry"
echo "   - Minimal CPU (0.25 cores) and memory (0.5GB)"
echo "   - Scale to zero (min-replicas: 0)"
echo "   - Auto-scale up to 2 replicas max"
echo ""
echo "📊 Resource summary:"
echo "   - Resource Group: $RESOURCE_GROUP"
echo "   - Container Registry: $CONTAINER_REGISTRY_NAME"
echo "   - Container App: $APP_NAME"
echo "   - Environment: $ENVIRONMENT_NAME"
echo ""
echo "🔧 To update the app, run:"
echo "   az acr build --registry $CONTAINER_REGISTRY_NAME --image $IMAGE_NAME:latest ."
echo "   az containerapp update --name $APP_NAME --resource-group $RESOURCE_GROUP --image $REGISTRY_SERVER/$IMAGE_NAME:latest"