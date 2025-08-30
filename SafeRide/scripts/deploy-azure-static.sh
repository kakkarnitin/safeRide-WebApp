#!/bin/bash

# Azure Static Web Apps + GitHub Codespaces Backend Deployment
# This approach uses Static Web Apps (generous free tier) + GitHub Codespaces for backend

set -e  # Exit on any error

# Variables
RESOURCE_GROUP="saferide-static-rg"
STATIC_APP_NAME="saferide-app"
LOCATION="East US 2"

echo "🚀 Starting Azure Static Web Apps deployment for SafeRide..."

# Check if user is logged in to Azure
if ! az account show &> /dev/null; then
    echo "❌ Please login to Azure CLI first: az login"
    exit 1
fi

# Register required resource providers
echo "📋 Registering required Azure resource providers..."
az provider register --namespace Microsoft.Web --wait

echo "✅ Resource providers registered successfully!"

# Create resource group
echo "📦 Creating resource group..."
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# Create Static Web App (without GitHub integration initially)
echo "🌐 Creating Azure Static Web App..."
az staticwebapp create \
  --name $STATIC_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION" \
  --sku Free

# Get the default hostname
HOSTNAME=$(az staticwebapp show \
  --name $STATIC_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query "defaultHostname" \
  --output tsv)

# Get deployment token for GitHub Actions
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list \
  --name $STATIC_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query "properties.apiKey" \
  --output tsv)

echo "✅ Azure Static Web App created successfully!"
echo ""
echo "📋 Deployment Details:"
echo "   - Resource Group: $RESOURCE_GROUP"
echo "   - Static Web App: $STATIC_APP_NAME"
echo "   - Public URL: https://$HOSTNAME"
echo "   - Tier: Free (generous limits)"
echo ""
echo "📋 GitHub Integration Setup:"
echo "1. Add this secret to your GitHub repository:"
echo "   Secret Name: AZURE_STATIC_WEB_APPS_API_TOKEN"
echo "   Secret Value: $DEPLOYMENT_TOKEN"
echo ""
echo "2. GitHub Actions workflow will be created automatically"
echo "   - Frontend: SafeRide/frontend"
echo "   - Backend API: SafeRide/backend/src/SafeRide.Api"
echo "   - Build output: dist"
echo ""
echo "3. Your app will be available at: https://$HOSTNAME"
echo ""
echo "💡 Benefits of Static Web Apps:"
echo "   - No quota limitations on free tier"
echo "   - Automatic CI/CD from GitHub"
echo "   - Built-in API support"
echo "   - Custom domains supported"
echo "   - Authentication providers built-in"
