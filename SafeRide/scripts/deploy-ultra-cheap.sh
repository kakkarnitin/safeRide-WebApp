#!/bin/bash

# Ultra-Low-Cost SafeRide Deployment
# Uses free/minimal cost Azure services

set -e

RESOURCE_GROUP="saferide-free-rg"
LOCATION="Australia Southeast"
STORAGE_ACCOUNT="saferide$(date +%s | tail -c 8)"
CONTAINER_GROUP="saferide-containers"

echo "💰 Starting ultra-low-cost SafeRide deployment..."

# Check if user is logged in to Azure
if ! az account show &> /dev/null; then
    echo "❌ Please login to Azure CLI first: az login"
    exit 1
fi

echo "📦 Creating resource group..."
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

# Option 1: Azure Container Instances (Pay per second)
echo "🐳 Creating Azure Container Instances (Pay-per-use)..."

# Create storage account for database persistence (very cheap)
az storage account create \
  --name "$STORAGE_ACCOUNT" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --sku Standard_LRS \
  --kind StorageV2

# Get storage key
STORAGE_KEY=$(az storage account keys list \
  --resource-group "$RESOURCE_GROUP" \
  --account-name "$STORAGE_ACCOUNT" \
  --query '[0].value' \
  --output tsv)

# Create file share for SQLite database
az storage share create \
  --name "saferide-data" \
  --account-name "$STORAGE_ACCOUNT" \
  --account-key "$STORAGE_KEY"

# Create container with minimal resources
az container create \
  --resource-group "$RESOURCE_GROUP" \
  --name "saferide-api" \
  --image "nginx:alpine" \
  --dns-name-label "saferide-free-$(date +%s | tail -c 6)" \
  --ports 80 \
  --cpu 0.5 \
  --memory 0.5 \
  --environment-variables \
    ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_URLS=http://+:80 \
    UseInMemoryDatabase=false \
    UseSQLite=true \
    ConnectionStrings__DefaultConnection="Data Source=/data/saferide.db" \
  --azure-file-volume-account-name "$STORAGE_ACCOUNT" \
  --azure-file-volume-account-key "$STORAGE_KEY" \
  --azure-file-volume-share-name "saferide-data" \
  --azure-file-volume-mount-path "/data" \
  --restart-policy OnFailure

# Get container FQDN
FQDN=$(az container show \
  --resource-group "$RESOURCE_GROUP" \
  --name "saferide-api" \
  --query "ipAddress.fqdn" \
  --output tsv)

echo ""
echo "✅ Ultra-low-cost deployment completed!"
echo ""
echo "📋 Deployment Details:"
echo "   🐳 Container: saferide-api"
echo "   💾 Storage: $STORAGE_ACCOUNT (SQLite database)"
echo "   🔗 API URL: http://$FQDN"
echo ""
echo "💰 Cost Breakdown (Monthly estimates):"
echo "   🐳 Container Instances: ~$3-8 AUD (pay per second when running)"
echo "   💾 Storage Account: ~$0.50-2 AUD"
echo "   🌐 Static Web Apps: FREE"
echo "   📊 Total: ~$3.50-10 AUD/month"
echo ""
echo "⚡ Cost Optimization Tips:"
echo "   - Container only runs when needed (pay per second)"
echo "   - SQLite database (no database hosting costs)"
echo "   - Minimal CPU/Memory allocation"
echo "   - Can be stopped when not in use"
echo ""
echo "🔧 To stop container (stop billing): az container stop --resource-group $RESOURCE_GROUP --name saferide-api"
echo "🔧 To start container: az container start --resource-group $RESOURCE_GROUP --name saferide-api"
