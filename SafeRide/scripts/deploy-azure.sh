#!/bin/bash

# Azure App Service Deployment Script
# Run this after installing Azure CLI and logging in

set -e  # Exit on any error

# Variables (update these with your actual values)
RESOURCE_GROUP="saferide-rg"
APP_SERVICE_PLAN="saferide-plan"
WEB_APP_NAME="saferide-api"
POSTGRES_SERVER="saferide-postgres"
POSTGRES_DB="saferide"
LOCATION="East US"
ADMIN_PASSWORD="SafeRide2024#Strong!"

echo "🚀 Starting Azure deployment for SafeRide..."

# Check if user is logged in to Azure
if ! az account show &> /dev/null; then
    echo "❌ Please login to Azure CLI first: az login"
    exit 1
fi

# Create resource group
echo "📦 Creating resource group..."
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# Create App Service Plan (B1 for basic production, upgrade as needed)
echo "📊 Creating App Service Plan..."
az appservice plan create --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP --sku B1 --is-linux

# Create PostgreSQL Flexible Server (updated syntax)
echo "🗄️ Creating PostgreSQL server..."
az postgres flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name $POSTGRES_SERVER \
  --location "$LOCATION" \
  --admin-user saferideadmin \
  --admin-password "$ADMIN_PASSWORD" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 14 \
  --storage-size 32 \
  --public-access 0.0.0.0-255.255.255.255

# Create PostgreSQL database
echo "🗃️ Creating database..."
az postgres flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $POSTGRES_SERVER \
  --database-name $POSTGRES_DB

# Create Web App with .NET 9.0
echo "🌐 Creating Web App..."
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --name $WEB_APP_NAME \
  --runtime "DOTNET|9.0"

# Configure connection string
echo "🔧 Configuring connection strings..."
CONNECTION_STRING="Host=$POSTGRES_SERVER.postgres.database.azure.com;Database=$POSTGRES_DB;Username=saferideadmin;Password=$ADMIN_PASSWORD;SSL Mode=Require"

az webapp config connection-string set \
  --resource-group $RESOURCE_GROUP \
  --name $WEB_APP_NAME \
  --connection-string-type PostgreSQL \
  --settings DefaultConnection="$CONNECTION_STRING"

# Configure app settings
echo "⚙️ Configuring app settings..."
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $WEB_APP_NAME \
  --settings \
    ASPNETCORE_ENVIRONMENT=Production \
    ConnectionStrings__DefaultConnection="$CONNECTION_STRING" \
    JwtSettings__SecretKey="$(openssl rand -base64 64)" \
    JwtSettings__Issuer="https://$WEB_APP_NAME.azurewebsites.net" \
    JwtSettings__Audience="https://$WEB_APP_NAME.azurewebsites.net" \
    JwtSettings__ExpirationHours=24

# Enable logging
echo "📝 Enabling logging..."
az webapp log config \
  --resource-group $RESOURCE_GROUP \
  --name $WEB_APP_NAME \
  --application-logging filesystem \
  --level information

echo "✅ Azure resources created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set up GitHub repository secrets:"
echo "   - Get publish profile: az webapp deployment list-publishing-profiles --resource-group $RESOURCE_GROUP --name $WEB_APP_NAME --xml"
echo "   - Add as secret AZURE_WEBAPP_PUBLISH_PROFILE in GitHub"
echo "   - Add variable AZURE_WEBAPP_NAME with value: $WEB_APP_NAME"
echo ""
echo "2. Configure Microsoft Authentication in Azure AD:"
echo "   - Go to Azure Portal > Azure Active Directory > App registrations"
echo "   - Update redirect URIs to include: https://$WEB_APP_NAME.azurewebsites.net"
echo ""
echo "3. Update production appsettings with:"
echo "   - Connection string: $CONNECTION_STRING"
echo "   - Microsoft Auth settings"
echo "   - Email SMTP settings"
echo ""
echo "🌐 Your app will be available at: https://$WEB_APP_NAME.azurewebsites.net"

az webapp config connection-string set \
  --resource-group $RESOURCE_GROUP \
  --name $WEB_APP_NAME \
  --connection-string-type PostgreSQL \
  --settings DefaultConnection="$CONNECTION_STRING"

echo "Azure resources created successfully!"
echo "Web App URL: https://$WEB_APP_NAME.azurewebsites.net"
echo "PostgreSQL Server: $POSTGRES_SERVER.postgres.database.azure.com"
