#!/bin/bash

# Azure Container Instances Deployment Script
# This avoids App Service quota limitations by using Azure Container Instances

set -e  # Exit on any error

# Variables
RESOURCE_GROUP="saferide-aci-rg"
CONTAINER_GROUP="saferide-containers"
API_CONTAINER="saferide-api"
STORAGE_ACCOUNT="saferide$(date +%s | tail -c 8)"
LOCATION="East US"
ADMIN_PASSWORD="SafeRide2024#Strong!"

echo "🚀 Starting Azure Container Instances deployment for SafeRide..."

# Check if user is logged in to Azure
if ! az account show &> /dev/null; then
    echo "❌ Please login to Azure CLI first: az login"
    exit 1
fi

# Register required resource providers
echo "📋 Registering required Azure resource providers..."
az provider register --namespace Microsoft.ContainerInstance --wait
az provider register --namespace Microsoft.Storage --wait

echo "✅ Resource providers registered successfully!"

# Create resource group
echo "📦 Creating resource group..."
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# Create storage account for SQLite database persistence
echo "💾 Creating storage account..."
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION" \
  --sku Standard_LRS \
  --kind StorageV2

# Get storage account key
STORAGE_KEY=$(az storage account keys list \
  --resource-group $RESOURCE_GROUP \
  --account-name $STORAGE_ACCOUNT \
  --query '[0].value' \
  --output tsv)

# Create file share for database persistence
echo "📁 Creating file share for database..."
az storage share create \
  --name "saferide-data" \
  --account-name $STORAGE_ACCOUNT \
  --account-key $STORAGE_KEY

# Create container group with the SafeRide API
echo "🐳 Creating container group..."
az container create \
  --resource-group $RESOURCE_GROUP \
  --name $CONTAINER_GROUP \
  --image "mcr.microsoft.com/dotnet/aspnet:9.0" \
  --dns-name-label "saferide-api-$(date +%s | tail -c 6)" \
  --ports 80 \
  --cpu 1 \
  --memory 1 \
  --environment-variables \
    ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_URLS=http://+:80 \
    UseSQLite=true \
    JwtSettings__SecretKey="$(openssl rand -base64 64)" \
    JwtSettings__Issuer="https://saferide-api.azurewebsites.net" \
    JwtSettings__Audience="https://saferide-api.azurewebsites.net" \
    JwtSettings__ExpirationHours=24 \
  --azure-file-volume-account-name $STORAGE_ACCOUNT \
  --azure-file-volume-account-key $STORAGE_KEY \
  --azure-file-volume-share-name "saferide-data" \
  --azure-file-volume-mount-path "/app/data"

# Get the container group FQDN
FQDN=$(az container show \
  --resource-group $RESOURCE_GROUP \
  --name $CONTAINER_GROUP \
  --query "ipAddress.fqdn" \
  --output tsv)

echo "✅ Azure Container Instance created successfully!"
echo ""
echo "📋 Deployment Details:"
echo "   - Resource Group: $RESOURCE_GROUP"
echo "   - Container Group: $CONTAINER_GROUP"
echo "   - Storage Account: $STORAGE_ACCOUNT"
echo "   - Public URL: http://$FQDN"
echo ""
echo "📋 Next steps:"
echo "1. Build and push your Docker image:"
echo "   docker build -t saferide-api ."
echo "   # Or use GitHub Actions to build and deploy"
echo ""
echo "2. Update GitHub Actions workflow to deploy to ACI"
echo ""
echo "3. Update your frontend environment to use: http://$FQDN"
echo ""
echo "💡 Note: This uses Azure Container Instances which has much higher quota limits"
echo "   and is suitable for development and moderate production workloads."
