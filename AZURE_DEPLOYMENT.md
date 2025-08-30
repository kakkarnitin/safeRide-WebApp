# Azure App Service Deployment Guide

This guide explains how to deploy the SafeRide application to Azure App Service with GitHub Actions for CI/CD.

## Prerequisites

1. **Azure Account**: An active Azure subscription
2. **Azure CLI**: Install from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
3. **GitHub Repository**: Code committed to a GitHub repository
4. **Azure AD App Registration**: For Microsoft authentication

## Step 1: Azure Resource Setup

### 1.1 Login to Azure CLI
```bash
az login
```

### 1.2 Run the deployment script
```bash
cd SafeRide/scripts
chmod +x deploy-azure.sh
./deploy-azure.sh
```

This script will create:
- Resource Group: `saferide-rg`
- App Service Plan: `saferide-plan` (B1 tier)
- PostgreSQL Flexible Server: `saferide-postgres`
- Web App: `saferide-api`
- Database: `saferide`

### 1.3 Get the publish profile
```bash
az webapp deployment list-publishing-profiles \
  --resource-group saferide-rg \
  --name saferide-api \
  --xml
```

Save this XML content - you'll need it for GitHub secrets.

## Step 2: GitHub Repository Configuration

### 2.1 Set up GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

**Add these secrets:**

1. **AZURE_WEBAPP_PUBLISH_PROFILE**
   - Value: The XML content from the publish profile above

**Add these variables:**

1. **AZURE_WEBAPP_NAME**
   - Value: `saferide-api` (or your chosen app name)

### 2.2 Enable GitHub Actions

The workflow file is already in `.github/workflows/deploy.yml` and will:
- Build the .NET 9.0 backend
- Deploy to Azure App Service
- Build the React frontend
- Deploy to GitHub Pages

## Step 3: Configure Microsoft Authentication

### 3.1 Update Azure AD App Registration

1. Go to Azure Portal → Azure Active Directory → App registrations
2. Find your SafeRide app registration
3. Go to Authentication → Redirect URIs
4. Add these URIs:
   - `https://saferide-api.azurewebsites.net/signin-oidc`
   - `https://kakkarnitin.github.io` (for frontend)

### 3.2 Update Production Settings

Update the following in your Azure App Service configuration:

```bash
az webapp config appsettings set \
  --resource-group saferide-rg \
  --name saferide-api \
  --settings \
    AzureAd__ClientId="your-azure-ad-client-id" \
    AzureAd__ClientSecret="your-azure-ad-client-secret"
```

## Step 4: Configure Email Settings

### 4.1 Set up Gmail App Password (recommended)

1. Enable 2FA on your Gmail account
2. Generate an App Password for SafeRide
3. Update Azure App Service settings:

```bash
az webapp config appsettings set \
  --resource-group saferide-rg \
  --name saferide-api \
  --settings \
    EmailSettings__SmtpUsername="your-email@gmail.com" \
    EmailSettings__SmtpPassword="your-app-password" \
    EmailSettings__FromEmail="your-email@gmail.com"
```

### 4.2 Alternative: Use Azure Communication Services

For production, consider using Azure Communication Services Email:

```bash
az webapp config appsettings set \
  --resource-group saferide-rg \
  --name saferide-api \
  --settings \
    EmailSettings__UseAzureEmail="true" \
    EmailSettings__AzureEmailConnectionString="your-connection-string"
```

## Step 5: Database Migration

The app will automatically run migrations on startup. You can also run them manually:

```bash
# Connect to your app via SSH (Advanced Tools → SSH)
dotnet ef database update
```

## Step 6: Frontend Configuration

### 6.1 Update Frontend Environment

The frontend is configured to deploy to GitHub Pages. Update `src/config/environment.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://saferide-api.azurewebsites.net/api',
  microsoftAuth: {
    clientId: 'your-azure-ad-client-id',
    redirectUri: 'https://kakkarnitin.github.io',
  }
};
```

## Step 7: SSL and Custom Domain (Optional)

### 7.1 Enable HTTPS Only
```bash
az webapp update \
  --resource-group saferide-rg \
  --name saferide-api \
  --https-only true
```

### 7.2 Add Custom Domain (if you have one)
```bash
az webapp config hostname add \
  --resource-group saferide-rg \
  --webapp-name saferide-api \
  --hostname your-custom-domain.com
```

## Step 8: Monitoring and Logging

### 8.1 Enable Application Insights
```bash
az monitor app-insights component create \
  --app saferide-insights \
  --location "East US" \
  --resource-group saferide-rg \
  --application-type web

# Get the instrumentation key
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --app saferide-insights \
  --resource-group saferide-rg \
  --query "instrumentationKey" -o tsv)

# Configure the web app to use Application Insights
az webapp config appsettings set \
  --resource-group saferide-rg \
  --name saferide-api \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY="$INSTRUMENTATION_KEY"
```

### 8.2 View Logs
```bash
# Stream live logs
az webapp log tail --resource-group saferide-rg --name saferide-api

# Download logs
az webapp log download --resource-group saferide-rg --name saferide-api
```

## Deployment URLs

After successful deployment:

- **Backend API**: https://saferide-api.azurewebsites.net
- **Frontend**: https://kakkarnitin.github.io
- **Swagger Documentation**: https://saferide-api.azurewebsites.net/swagger

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that all NuGet packages are properly referenced
2. **Database Connection**: Verify connection string and firewall rules
3. **Authentication Issues**: Check Azure AD configuration and redirect URIs
4. **CORS Errors**: Update allowed origins in appsettings.Production.json

### Useful Commands

```bash
# Check app status
az webapp show --resource-group saferide-rg --name saferide-api

# Restart the app
az webapp restart --resource-group saferide-rg --name saferide-api

# View configuration
az webapp config show --resource-group saferide-rg --name saferide-api
```

## Security Checklist

- [ ] Use App Passwords for email authentication
- [ ] Store secrets in Azure Key Vault (for production)
- [ ] Enable Azure AD authentication
- [ ] Configure proper CORS settings
- [ ] Use HTTPS only
- [ ] Regular security updates
- [ ] Monitor with Application Insights

## Cost Optimization

- **B1 App Service Plan**: ~$13/month
- **PostgreSQL Flexible Server (Burstable B1ms)**: ~$12/month
- **Total estimated cost**: ~$25/month

For production, consider:
- Scaling up during peak hours
- Using Azure SQL Database for better performance
- Implementing CDN for static assets
