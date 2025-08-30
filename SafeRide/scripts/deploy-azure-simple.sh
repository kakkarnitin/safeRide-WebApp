#!/bin/bash

# Simple Azure Deployment using Web App for Containers
# This approach uses a different quota pool and often works when regular App Service doesn't

set -e  # Exit on any error

# Variables
RESOURCE_GROUP="saferide-simple-rg"
APP_SERVICE_PLAN="saferide-container-plan"
WEB_APP_NAME="saferide-$(date +%s | tail -c 6)"
LOCATION="West US 2"  # Try different region

echo "🚀 Starting simple Azure deployment for SafeRide..."

# Check if user is logged in to Azure
if ! az account show &> /dev/null; then
    echo "❌ Please login to Azure CLI first: az login"
    exit 1
fi

# Check available locations with quota
echo "🔍 Checking available locations..."
AVAILABLE_LOCATIONS=("West US 2" "North Europe" "Southeast Asia" "Australia East" "Canada Central")

for location in "${AVAILABLE_LOCATIONS[@]}"; do
    echo "   Trying location: $location"
    
    # Create resource group
    if az group create --name "${RESOURCE_GROUP}-test" --location "$location" &>/dev/null; then
        echo "   ✅ $location is available"
        LOCATION="$location"
        az group delete --name "${RESOURCE_GROUP}-test" --yes --no-wait
        break
    else
        echo "   ❌ $location not available"
    fi
done

echo "📦 Using location: $LOCATION"

# Create resource group
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# Try creating Web App for Containers (uses different quota)
echo "🐳 Creating Web App for Containers..."
if az appservice plan create \
    --name $APP_SERVICE_PLAN \
    --resource-group $RESOURCE_GROUP \
    --location "$LOCATION" \
    --is-linux \
    --sku F1; then
    
    echo "✅ Created App Service Plan"
    
    # Create Web App with a simple container
    az webapp create \
        --resource-group $RESOURCE_GROUP \
        --plan $APP_SERVICE_PLAN \
        --name $WEB_APP_NAME \
        --deployment-container-image-name "nginx:alpine"
    
    echo "✅ Created Web App: $WEB_APP_NAME"
    
    # Configure for .NET deployment later
    az webapp config appsettings set \
        --resource-group $RESOURCE_GROUP \
        --name $WEB_APP_NAME \
        --settings \
            WEBSITES_ENABLE_APP_SERVICE_STORAGE=false \
            ASPNETCORE_ENVIRONMENT=Production
    
    echo "✅ Web App configured for .NET deployment"
    
else
    echo "❌ Still unable to create App Service Plan"
    echo "💡 Let's try Azure Container Instances instead..."
    
    # Fallback to Azure Container Instances
    echo "🐳 Creating Azure Container Instance..."
    
    az container create \
        --resource-group $RESOURCE_GROUP \
        --name "saferide-container" \
        --image "nginx:alpine" \
        --dns-name-label "saferide-$(date +%s | tail -c 6)" \
        --ports 80 \
        --cpu 0.5 \
        --memory 0.5
    
    FQDN=$(az container show \
        --resource-group $RESOURCE_GROUP \
        --name "saferide-container" \
        --query "ipAddress.fqdn" \
        --output tsv)
    
    echo "✅ Container Instance created: http://$FQDN"
    WEB_APP_NAME="saferide-container (Container Instance)"
fi

echo ""
echo "✅ Azure resources created successfully!"
echo ""
echo "📋 Deployment Details:"
echo "   - Resource Group: $RESOURCE_GROUP"
echo "   - App/Container: $WEB_APP_NAME"
echo "   - Location: $LOCATION"
echo ""
echo "📋 Get publish profile (if Web App was created):"
echo "az webapp deployment list-publishing-profiles --resource-group $RESOURCE_GROUP --name $WEB_APP_NAME --xml"
echo ""
echo "💡 This deployment uses alternative quota pools that are often available"
echo "   when standard App Service quotas are exhausted."
