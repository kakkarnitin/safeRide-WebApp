#!/bin/bash

# Setup Azure Key Vault for SafeRide secrets
echo "🔐 Setting up Azure Key Vault for SafeRide..."

RESOURCE_GROUP="saferide-free-rg"
VAULT_NAME="saferide-vault-$(date +%s | tail -c 6)"
LOCATION="Australia East"

# Create Key Vault
echo "📦 Creating Key Vault: $VAULT_NAME"
az keyvault create \
  --name "$VAULT_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --sku standard

# Set secrets (you'll need to replace these with your actual values)
echo "🔑 Setting Microsoft Entra secrets..."

# Get your tenant ID and client ID from Azure AD app registration
echo "Please provide your Microsoft Entra app details:"
read -p "Enter your Azure AD Client ID: " CLIENT_ID
read -s -p "Enter your Azure AD Client Secret: " CLIENT_SECRET
echo ""
read -p "Enter your Azure AD Tenant ID: " TENANT_ID

# Store secrets in Key Vault
az keyvault secret set --vault-name "$VAULT_NAME" --name "MicrosoftClientId" --value "$CLIENT_ID"
az keyvault secret set --vault-name "$VAULT_NAME" --name "MicrosoftClientSecret" --value "$CLIENT_SECRET"
az keyvault secret set --vault-name "$VAULT_NAME" --name "MicrosoftTenantId" --value "$TENANT_ID"

# Optional: Add other secrets like email settings
read -p "Enter SMTP password (optional, press enter to skip): " SMTP_PASSWORD
if [ ! -z "$SMTP_PASSWORD" ]; then
  az keyvault secret set --vault-name "$VAULT_NAME" --name "SmtpPassword" --value "$SMTP_PASSWORD"
fi

echo ""
echo "✅ Key Vault setup completed!"
echo "📋 Vault Name: $VAULT_NAME"
echo "🔗 Vault URL: https://$VAULT_NAME.vault.azure.net/"

# Give the service principal access to the vault
echo "🔐 Setting up service principal access..."
SERVICE_PRINCIPAL_ID=$(az ad sp list --display-name "SafeRide-GitHub-Actions" --query "[0].id" --output tsv)

if [ ! -z "$SERVICE_PRINCIPAL_ID" ]; then
  az keyvault set-policy \
    --name "$VAULT_NAME" \
    --object-id "$SERVICE_PRINCIPAL_ID" \
    --secret-permissions get list
  
  echo "✅ Service principal access granted"
else
  echo "⚠️ Service principal not found. You may need to manually grant access."
fi

echo ""
echo "🎉 Setup completed! Key Vault name: $VAULT_NAME"
