# Azure Deployment Guide for SafeRide

## Prerequisites

1. **Azure CLI** - Install from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
2. **Azure Subscription** - Free tier available at https://azure.microsoft.com/free/
3. **Git** - For version control

## Step 1: Install Azure CLI and Login

```bash
# Install Azure CLI (if not already installed)
# On macOS:
brew install azure-cli

# Login to Azure
az login
```

## Step 2: Set Up Azure Resources

```bash
# Navigate to scripts directory
cd SafeRide/scripts

# Make script executable (if not already done)
chmod +x deploy-azure.sh

# Edit the script with your preferred names
# Update these variables in deploy-azure.sh:
# - RESOURCE_GROUP="your-resource-group-name"
# - WEB_APP_NAME="your-unique-app-name"
# - POSTGRES_SERVER="your-unique-postgres-name"

# Run the deployment script
./deploy-azure.sh
```

## Step 3: Update Configuration

1. **Update Frontend Config**:
   ```typescript
   // In SafeRide/frontend/src/config/environment.ts
   export const config = {
     apiBaseUrl: process.env.NODE_ENV === 'production' 
       ? 'https://YOUR-APP-NAME.azurewebsites.net/api'  // Replace with your actual Azure URL
       : 'http://localhost:5001/api',
     environment: process.env.NODE_ENV,
   };
   ```

2. **Update Production CORS**:
   ```json
   // In SafeRide/backend/src/SafeRide.Api/appsettings.Production.json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Your Azure PostgreSQL connection string from Step 2"
     },
     "Cors": {
       "AllowedOrigins": [
         "https://kakkarnitin.github.io",
         "https://your-custom-domain.com"
       ]
     }
   }
   ```

## Step 4: Deploy Backend to Azure

### Option A: Manual Deployment (Recommended for first time)

```bash
# Navigate to API project
cd SafeRide/backend/src/SafeRide.Api

# Publish the application
dotnet publish -c Release -o ./publish

# Create a zip file
cd publish
zip -r ../app.zip .
cd ..

# Deploy to Azure
az webapp deployment source config-zip \
  --resource-group saferide-rg \
  --name your-app-name \
  --src app.zip
```

### Option B: GitHub Actions (Automated)

1. **Get Publish Profile**:
   ```bash
   az webapp deployment list-publishing-profiles \
     --resource-group saferide-rg \
     --name your-app-name \
     --xml
   ```

2. **Add GitHub Secret**:
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add secret: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Paste the XML content from step 1

3. **Push to trigger deployment**:
   ```bash
   git add .
   git commit -m "Configure Azure deployment"
   git push origin main
   ```

## Step 5: Deploy Frontend to GitHub Pages

1. **Enable GitHub Pages**:
   - Go to repository Settings
   - Pages section
   - Source: GitHub Actions

2. **The GitHub Action will automatically**:
   - Build your React app
   - Deploy to GitHub Pages
   - Available at: `https://kakkarnitin.github.io/safeRide-WebApp/`

## Step 6: Database Migration

```bash
# After backend is deployed, run migration
# Connect to your Azure Web App via SSH or use Azure Cloud Shell

# Install EF tools if not available
dotnet tool install --global dotnet-ef

# Run migrations (this will create tables)
dotnet ef database update --project SafeRide.Infrastructure --startup-project SafeRide.Api
```

## Step 7: Verify Deployment

1. **Backend Health Check**:
   ```bash
   curl https://your-app-name.azurewebsites.net/api/schools
   ```

2. **Frontend Access**:
   Visit: `https://kakkarnitin.github.io/safeRide-WebApp/`

## Cost Estimation

### Monthly Costs (USD):
- **App Service Basic B1**: ~$13.14/month
- **PostgreSQL Basic**: ~$24.84/month
- **Total**: ~$38/month

### Free Tier Options:
- **App Service Free F1**: Free (limited)
- **PostgreSQL**: No free tier, but minimal usage ~$5/month
- **GitHub Pages**: Free

## Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Check that your frontend URL is in the CORS allowed origins
   - Verify the backend URL in frontend config

2. **Database Connection**:
   - Verify connection string in Azure App Service configuration
   - Check firewall rules for PostgreSQL

3. **Deployment Failures**:
   - Check Azure App Service logs
   - Verify .NET version compatibility

### Useful Commands:

```bash
# View Azure App Service logs
az webapp log tail --resource-group saferide-rg --name your-app-name

# Restart the web app
az webapp restart --resource-group saferide-rg --name your-app-name

# Scale the app (if needed)
az appservice plan update --resource-group saferide-rg --name saferide-plan --sku B2
```

## Security Considerations

1. **Environment Variables**: Store sensitive data in Azure App Service Configuration
2. **SSL/TLS**: Azure provides free SSL certificates
3. **Database Security**: Use strong passwords and restrict access
4. **CORS**: Only allow necessary origins

## Next Steps

1. **Custom Domain**: Configure custom domain for your API
2. **SSL Certificate**: Azure provides free SSL, or use custom certificate
3. **Monitoring**: Set up Application Insights for monitoring
4. **Scaling**: Configure auto-scaling based on usage
5. **Backup**: Set up automated backups for your database

## Support

- **Azure Documentation**: https://docs.microsoft.com/en-us/azure/
- **App Service**: https://docs.microsoft.com/en-us/azure/app-service/
- **PostgreSQL**: https://docs.microsoft.com/en-us/azure/postgresql/
