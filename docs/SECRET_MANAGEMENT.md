# Microsoft Entra ID Secret Management for SafeRide

This guide explains how to securely manage Microsoft Entra ID (Azure AD) secrets for your SafeRide application deployment.

## 🔐 Required Secrets

Your SafeRide application needs these Microsoft Entra ID secrets:

1. **Client ID** - Application (client) ID from Azure AD app registration
2. **Client Secret** - Client secret from Azure AD app registration  
3. **Tenant ID** - Directory (tenant) ID from Azure AD
4. **SMTP Password** - For email notifications (optional)

## 📋 Getting Your Microsoft Entra ID Values

### Step 1: Find Your App Registration
1. Go to [Azure Portal](https://portal.azure.com) → Azure Active Directory → App registrations
2. Find your SafeRide app registration

### Step 2: Get Client ID and Tenant ID
```bash
# Get your app registration details
az ad app list --display-name "SafeRide" --query "[0].{ClientId:appId,DisplayName:displayName}"

# Get your tenant ID
az account show --query "tenantId" --output tsv
```

### Step 3: Create/Get Client Secret
```bash
# Create a new client secret (if needed)
az ad app credential reset --id YOUR_CLIENT_ID --display-name "SafeRide-Production"
```

## 🔒 Security Options

### Option 1: GitHub Repository Secrets (Recommended for MVP)

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `MICROSOFT_CLIENT_ID` | Azure AD Application ID | `12345678-1234-1234-1234-123456789012` |
| `MICROSOFT_CLIENT_SECRET` | Azure AD Client Secret | `very-secret-string-from-azure` |
| `MICROSOFT_TENANT_ID` | Azure AD Tenant ID | `87654321-4321-4321-4321-210987654321` |
| `SMTP_PASSWORD` | Email SMTP password | `your-email-password` |

### Option 2: Azure Key Vault (Production-Ready)

```bash
# Run the Key Vault setup script
./scripts/setup-keyvault.sh

# Or create manually:
az keyvault create --name "saferide-vault-prod" --resource-group "saferide-free-rg"
az keyvault secret set --vault-name "saferide-vault-prod" --name "MicrosoftClientSecret" --value "your-secret"
```

## 🔧 Backend Configuration

Your .NET application will receive these as environment variables:

```csharp
// appsettings.Production.json
{
  "Authentication": {
    "Microsoft": {
      "ClientId": "will-be-set-from-environment",
      "ClientSecret": "will-be-set-from-environment", 
      "TenantId": "will-be-set-from-environment"
    }
  },
  "Email": {
    "SmtpPassword": "will-be-set-from-environment"
  }
}
```

## 🚀 Deployment Integration

The GitHub Actions workflows now automatically inject these secrets:

```yaml
environment-variables:
  Authentication__Microsoft__ClientId: ${{ secrets.MICROSOFT_CLIENT_ID }}
  Authentication__Microsoft__ClientSecret: ${{ secrets.MICROSOFT_CLIENT_SECRET }}
  Authentication__Microsoft__TenantId: ${{ secrets.MICROSOFT_TENANT_ID }}
  Email__SmtpPassword: ${{ secrets.SMTP_PASSWORD }}
```

## ✅ Security Best Practices

1. **Never commit secrets** to your repository
2. **Use Key Vault** for production deployments
3. **Rotate secrets regularly** (every 6-12 months)
4. **Use managed identity** when possible
5. **Monitor secret access** in Azure logs

## 🔄 Secret Rotation

To rotate secrets:

```bash
# Create new client secret
az ad app credential reset --id YOUR_CLIENT_ID

# Update GitHub secret or Key Vault
# Redeploy application to pick up new secret
```

## 🧪 Testing Locally

For local development, use User Secrets:

```bash
cd SafeRide/backend/src/SafeRide.Api

dotnet user-secrets set "Authentication:Microsoft:ClientSecret" "your-local-secret"
dotnet user-secrets set "Authentication:Microsoft:ClientId" "your-client-id"
dotnet user-secrets set "Authentication:Microsoft:TenantId" "your-tenant-id"
```

## 📞 Troubleshooting

### Common Issues:

1. **"Invalid client secret"** - Check the secret hasn't expired
2. **"Tenant not found"** - Verify tenant ID is correct
3. **"Application not found"** - Ensure client ID is correct

### Debug Commands:

```bash
# Verify your app registration
az ad app show --id YOUR_CLIENT_ID

# Check secret expiration
az ad app credential list --id YOUR_CLIENT_ID
```
