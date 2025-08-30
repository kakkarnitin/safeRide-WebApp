#!/bin/bash

# Azure App Service Deployment Script - Free/Shared Tier Version
# This version prioritizes free and shared tiers to avoid quota issues

set -e  # Exit on any error

# Variables (update these with your actual values)
RESOURCE_GROUP="saferide-rg-free"
APP_SERVICE_PLAN="saferide-plan-free"
WEB_APP_NAME="saferide-api-$(date +%s)"  # Add timestamp to ensure uniqueness
POSTGRES_SERVER="saferide-postgres-$(date +%s)"
POSTGRES_DB="saferide"
LOCATION="Central US"  # Often has better quota availability
ADMIN_PASSWORD="SafeRide2024#Strong!"

echo "🚀 Starting Azure deployment for SafeRide (Free/Shared tier)..."

# Check if user is logged in to Azure
if ! az account show &> /dev/null; then
    echo "❌ Please login to Azure CLI first: az login"
    exit 1
fi

# Register required resource providers
echo "📋 Registering required Azure resource providers..."
echo "   - Microsoft.Web (App Service)"
az provider register --namespace Microsoft.Web --wait

echo "   - Microsoft.DBforPostgreSQL (PostgreSQL)"
az provider register --namespace Microsoft.DBforPostgreSQL --wait

echo "✅ Resource providers registered successfully!"

# Create resource group
echo "📦 Creating resource group..."
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# Create App Service Plan - Try free options first
echo "📊 Creating App Service Plan..."

if az webapp up --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --location "$LOCATION" --sku F1 --runtime "DOTNETCORE:9.0" --dryrun 2>/dev/null; then
    echo "✅ F1 Free tier available - using webapp up command"
    # Use az webapp up which is more quota-friendly
    echo "🌐 Creating Web App with F1 tier..."
    az webapp up --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP --location "$LOCATION" --sku F1 --runtime "DOTNETCORE:9.0"
else
    echo "   F1 not available, trying alternative approach..."
    
    # Try creating a consumption-based App Service Plan
    if az appservice plan create --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP --sku F1 --location "$LOCATION" 2>/dev/null; then
        echo "✅ Created F1 Free tier App Service Plan"
        PLAN_CREATED=true
    elif az appservice plan create --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP --sku D1 --location "$LOCATION" 2>/dev/null; then
        echo "✅ Created D1 Shared tier App Service Plan"
        PLAN_CREATED=true
    else
        echo "❌ Unable to create App Service Plan in $LOCATION"
        echo "💡 Trying different region: East US 2..."
        LOCATION="East US 2"
        
        if az appservice plan create --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP --sku F1 --location "$LOCATION" 2>/dev/null; then
            echo "✅ Created F1 Free tier App Service Plan in East US 2"
            PLAN_CREATED=true
        else
            echo "❌ Unable to create App Service Plan with available quota"
            echo "💡 You may need to:"
            echo "   1. Request quota increase in Azure portal"
            echo "   2. Try a different subscription"
            echo "   3. Use Azure Container Instances instead"
            exit 1
        fi
    fi
    
    if [ "$PLAN_CREATED" = true ]; then
        # Create Web App
        echo "🌐 Creating Web App..."
        az webapp create \
          --resource-group $RESOURCE_GROUP \
          --plan $APP_SERVICE_PLAN \
          --name $WEB_APP_NAME \
          --runtime "DOTNET:9.0"
    fi
fi

# For free tier, we'll use SQLite instead of PostgreSQL to avoid additional costs
echo "🗄️ Configuring database..."
echo "   Using SQLite for free tier deployment"

# Configure app settings for SQLite
echo "⚙️ Configuring app settings..."
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $WEB_APP_NAME \
  --settings \
    ASPNETCORE_ENVIRONMENT=Production \
    UseInMemoryDatabase=false \
    UseSQLite=true \
    JwtSettings__SecretKey="$(openssl rand -base64 64)" \
    JwtSettings__Issuer="https://$WEB_APP_NAME.azurewebsites.net" \
    JwtSettings__Audience="https://$WEB_APP_NAME.azurewebsites.net" \
    JwtSettings__ExpirationHours=24

# Enable logging
echo "📝 Enabling logging..."
az webapp log config \
  --resource-group $RESOURCE_GROUP \
  --name $WEB_APP_NAME \
  --application-logging azureblobstorage \
  --level information \
  --retention-days 3

echo "✅ Azure resources created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set up GitHub repository secrets:"
echo "   - Get publish profile: az webapp deployment list-publishing-profiles --resource-group $RESOURCE_GROUP --name $WEB_APP_NAME --xml"
echo "   - Add as secret AZURE_WEBAPP_PUBLISH_PROFILE in GitHub"
echo "   - Add variable AZURE_WEBAPP_NAME with value: $WEB_APP_NAME"
echo ""
echo "2. Your app details:"
echo "   - Resource Group: $RESOURCE_GROUP"
echo "   - App Name: $WEB_APP_NAME"
echo "   - Location: $LOCATION"
echo "   - Database: SQLite (suitable for development/small scale)"
echo ""
echo "🌐 Your app will be available at: https://$WEB_APP_NAME.azurewebsites.net"
echo ""
echo "💡 Note: This deployment uses free/shared tiers suitable for development."
echo "   For production, consider upgrading to Basic tier when quota is available."
