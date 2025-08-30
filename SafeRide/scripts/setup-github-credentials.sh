#!/bin/bash

# Script to create Azure Service Principal for GitHub Actions
echo "🔐 Creating Azure Service Principal for GitHub Actions..."

# Get subscription ID
SUBSCRIPTION_ID=$(az account show --query id --output tsv)
echo "📋 Using subscription: $SUBSCRIPTION_ID"

# Get the Static Web App resource group (assuming it was created)
RESOURCE_GROUP="saferide-static-rg"

# Create service principal with contributor role for the resource group
echo "👤 Creating service principal..."
SP_OUTPUT=$(az ad sp create-for-rbac \
  --name "saferide-github-actions" \
  --role "Contributor" \
  --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP" \
  --sdk-auth)

echo ""
echo "✅ Service Principal Created!"
echo ""
echo "📋 GitHub Secrets Setup:"
echo "Go to your GitHub repository → Settings → Secrets and variables → Actions"
echo ""
echo "Add these secrets:"
echo ""
echo "1. Secret Name: AZURE_CREDENTIALS"
echo "   Secret Value (copy everything below this line):"
echo "----------------------------------------"
echo "$SP_OUTPUT"
echo "----------------------------------------"
echo ""
echo "2. If you don't have it already, get the Static Web Apps token:"
az staticwebapp secrets list \
  --name "saferide-app" \
  --resource-group "$RESOURCE_GROUP" \
  --query "properties.apiKey" \
  --output tsv 2>/dev/null && echo "   Add this as AZURE_STATIC_WEB_APPS_API_TOKEN" || echo "   Run the static web app script first to get this token"
echo ""
echo "💡 After adding these secrets, push your code to trigger the deployment!"
