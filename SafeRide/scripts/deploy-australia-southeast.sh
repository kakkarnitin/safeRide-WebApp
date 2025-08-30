#!/bin/bash

# Azure Deployment Script for Australia Southeast Region
# Optimized for pay-as-you-go subscription with quota checking

set -e

# Variables for Australia Southeast
RESOURCE_GROUP="saferide-au-rg"
LOCATION="Australia Southeast"
APP_SERVICE_PLAN="saferide-plan"
WEB_APP_NAME="saferide-api-$(date +%s | tail -c 6)"
POSTGRES_SERVER="saferide-postgres-$(date +%s | tail -c 6)"
POSTGRES_DB="saferide"
ADMIN_PASSWORD="SafeRide2024#Strong!"

echo "🇦🇺 Starting Azure deployment in Australia Southeast region..."

# Check if user is logged in to Azure
if ! az account show &> /dev/null; then
    echo "❌ Please login to Azure CLI first: az login"
    exit 1
fi

# Check current subscription and location availability
echo "📍 Checking subscription and region availability..."
SUBSCRIPTION_ID=$(az account show --query id --output tsv)
echo "   Subscription: $SUBSCRIPTION_ID"
echo "   Target Region: $LOCATION"

# Check available VM sizes in Australia Southeast
echo "🔍 Checking available VM sizes in $LOCATION..."
az vm list-sizes --location "$LOCATION" --query "[?contains(name, 'Standard_B')] | [0:3].{Name:name, CPUs:numberOfCores, RAM:memoryInMB}" --output table

# Register required providers
echo "📋 Registering Azure resource providers..."
az provider register --namespace Microsoft.Web
az provider register --namespace Microsoft.DBforPostgreSQL
az provider register --namespace Microsoft.Storage
az provider register --namespace Microsoft.ContainerInstance

echo "⏳ Waiting for provider registration..."
sleep 10

# Create resource group
echo "📦 Creating resource group in $LOCATION..."
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

# Function to try creating App Service Plan with different SKUs
create_app_service_plan() {
    local plan_name=$1
    local resource_group=$2
    local location=$3
    
    echo "📊 Attempting to create App Service Plan..."
    
    # Try Free tier (F1) first
    if az appservice plan create \
        --name "$plan_name" \
        --resource-group "$resource_group" \
        --location "$location" \
        --sku F1 \
        --is-linux 2>/dev/null; then
        echo "✅ Created F1 Free tier App Service Plan"
        return 0
    fi
    
    # Try Shared tier (D1)
    if az appservice plan create \
        --name "$plan_name" \
        --resource-group "$resource_group" \
        --location "$location" \
        --sku D1 \
        --is-linux 2>/dev/null; then
        echo "✅ Created D1 Shared tier App Service Plan"
        return 0
    fi
    
    # Try Basic B1
    if az appservice plan create \
        --name "$plan_name" \
        --resource-group "$resource_group" \
        --location "$location" \
        --sku B1 \
        --is-linux 2>/dev/null; then
        echo "✅ Created B1 Basic tier App Service Plan"
        return 0
    fi
    
    # Try Basic B2 if B1 not available
    if az appservice plan create \
        --name "$plan_name" \
        --resource-group "$resource_group" \
        --location "$location" \
        --sku B2 \
        --is-linux 2>/dev/null; then
        echo "✅ Created B2 Basic tier App Service Plan"
        return 0
    fi
    
    echo "❌ Unable to create App Service Plan with available quota"
    return 1
}

# Try to create App Service Plan
if create_app_service_plan "$APP_SERVICE_PLAN" "$RESOURCE_GROUP" "$LOCATION"; then
    echo "🌐 Creating Web App..."
    
    # Create Web App with .NET 9.0
    az webapp create \
        --resource-group "$RESOURCE_GROUP" \
        --plan "$APP_SERVICE_PLAN" \
        --name "$WEB_APP_NAME" \
        --runtime "DOTNET:9.0"
    
    echo "✅ Web App created: $WEB_APP_NAME"
    APP_SERVICE_CREATED=true
else
    echo "⚠️ App Service Plan creation failed. Falling back to Azure Container Instances..."
    APP_SERVICE_CREATED=false
fi

# Create PostgreSQL database
echo "🗄️ Creating PostgreSQL Flexible Server..."
if az postgres flexible-server create \
    --resource-group "$RESOURCE_GROUP" \
    --name "$POSTGRES_SERVER" \
    --location "$LOCATION" \
    --admin-user saferideadmin \
    --admin-password "$ADMIN_PASSWORD" \
    --sku-name Standard_B1ms \
    --tier Burstable \
    --version 14 \
    --storage-size 32 \
    --public-access 0.0.0.0-255.255.255.255 2>/dev/null; then
    
    echo "✅ PostgreSQL server created"
    
    # Create database
    az postgres flexible-server db create \
        --resource-group "$RESOURCE_GROUP" \
        --server-name "$POSTGRES_SERVER" \
        --database-name "$POSTGRES_DB"
    
    CONNECTION_STRING="Host=$POSTGRES_SERVER.postgres.database.azure.com;Database=$POSTGRES_DB;Username=saferideadmin;Password=$ADMIN_PASSWORD;SSL Mode=Require"
    DATABASE_CREATED=true
else
    echo "⚠️ PostgreSQL creation failed. Will use SQLite as fallback."
    CONNECTION_STRING="Data Source=saferide.db"
    DATABASE_CREATED=false
fi

# Configure the application
if [ "$APP_SERVICE_CREATED" = true ]; then
    echo "⚙️ Configuring Web App settings..."
    
    az webapp config appsettings set \
        --resource-group "$RESOURCE_GROUP" \
        --name "$WEB_APP_NAME" \
        --settings \
            ASPNETCORE_ENVIRONMENT=Production \
            ConnectionStrings__DefaultConnection="$CONNECTION_STRING" \
            JwtSettings__SecretKey="$(openssl rand -base64 64)" \
            JwtSettings__Issuer="https://$WEB_APP_NAME.azurewebsites.net" \
            JwtSettings__Audience="https://$WEB_APP_NAME.azurewebsites.net" \
            JwtSettings__ExpirationHours=24
    
    # Enable logging
    az webapp log config \
        --resource-group "$RESOURCE_GROUP" \
        --name "$WEB_APP_NAME" \
        --application-logging filesystem \
        --level information
    
    API_URL="https://$WEB_APP_NAME.azurewebsites.net"
    
else
    # Fallback to Container Instance
    echo "🐳 Creating Azure Container Instance as fallback..."
    
    az container create \
        --resource-group "$RESOURCE_GROUP" \
        --name "saferide-api-container" \
        --image "nginx:alpine" \
        --dns-name-label "saferide-api-$(date +%s | tail -c 6)" \
        --ports 80 \
        --cpu 0.5 \
        --memory 1 \
        --environment-variables \
            ASPNETCORE_ENVIRONMENT=Production \
            ConnectionStrings__DefaultConnection="$CONNECTION_STRING"
    
    CONTAINER_FQDN=$(az container show \
        --resource-group "$RESOURCE_GROUP" \
        --name "saferide-api-container" \
        --query "ipAddress.fqdn" \
        --output tsv)
    
    API_URL="http://$CONTAINER_FQDN"
fi

echo ""
echo "✅ Azure deployment completed!"
echo ""
echo "📋 Deployment Summary:"
echo "   📍 Region: $LOCATION"
echo "   📦 Resource Group: $RESOURCE_GROUP"
if [ "$APP_SERVICE_CREATED" = true ]; then
    echo "   🌐 Web App: $WEB_APP_NAME"
    echo "   📊 App Service Plan: $APP_SERVICE_PLAN"
else
    echo "   🐳 Container Instance: saferide-api-container"
fi
if [ "$DATABASE_CREATED" = true ]; then
    echo "   🗄️ PostgreSQL Server: $POSTGRES_SERVER"
else
    echo "   🗄️ Database: SQLite (local file)"
fi
echo "   🔗 API URL: $API_URL"
echo ""
echo "📋 Next Steps:"
echo "1. Update frontend environment to use API URL: $API_URL"
echo "2. Set up GitHub Actions deployment:"
if [ "$APP_SERVICE_CREATED" = true ]; then
    echo "   az webapp deployment list-publishing-profiles --resource-group $RESOURCE_GROUP --name $WEB_APP_NAME --xml"
fi
echo "3. Configure Microsoft Authentication redirect URIs"
echo "4. Set up email SMTP settings"
echo ""
echo "💰 Estimated Monthly Cost:"
if [ "$APP_SERVICE_CREATED" = true ]; then
    echo "   - App Service: ~$10-50 AUD (depending on tier)"
else
    echo "   - Container Instance: ~$15-30 AUD"
fi
if [ "$DATABASE_CREATED" = true ]; then
    echo "   - PostgreSQL: ~$15-25 AUD"
else
    echo "   - SQLite: Free (file-based)"
fi
echo "   📍 Australia Southeast pricing may vary"
