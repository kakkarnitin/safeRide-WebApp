# Complete SafeRide Deployment - Australia Southeast

## 🎯 Current Deployment Architecture

### Frontend (Already Deployed ✅)
- **Platform**: Azure Static Web Apps
- **URL**: https://calm-stone-0187f440f.2.azurestaticapps.net
- **Status**: ✅ Working

### Backend + Database (In Progress 🚀)
- **Platform**: Azure App Service + PostgreSQL
- **Region**: Australia Southeast
- **Status**: 🚀 Deploying via script

## 📋 What the Australia Southeast Script Deploys

### 1. **Web App Service** (.NET 9.0 API)
- **Tries multiple tiers**: F1 (Free) → D1 (Shared) → B1 (Basic) → B2 (Basic)
- **Runtime**: .NET 9.0
- **Auto-scaling**: Enabled
- **Logging**: Application Insights ready

### 2. **PostgreSQL Database**
- **Type**: Flexible Server
- **Tier**: Burstable B1ms (cost-effective)
- **Storage**: 32GB
- **Version**: PostgreSQL 14
- **Backup**: 7-day retention

### 3. **Fallback Options**
- **If App Service fails**: Azure Container Instances
- **If PostgreSQL fails**: SQLite (file-based)

## 🔄 Complete Deployment Steps

### Step 1: Backend Deployment (Running Now)
```bash
# Already started
cd SafeRide/scripts
./deploy-australia-southeast.sh
```

### Step 2: Connect Frontend to Backend
After backend deployment completes, update frontend config:

```typescript
// In production.ts
apiUrl: 'https://your-new-app-name.azurewebsites.net/api'
```

### Step 3: GitHub Actions Setup
Add these secrets to GitHub:

**Required Secrets:**
- `AZURE_WEBAPP_PUBLISH_PROFILE_AU`: Get from Azure CLI output
- `AZURE_CREDENTIALS_AU`: Service principal for Australia region

**Required Variables:**
- `AZURE_WEBAPP_NAME_AU`: Your app name from deployment

### Step 4: Authentication Configuration
Update Azure AD app registration:
- Add redirect URI: `https://your-app-name.azurewebsites.net`
- Configure CORS in backend for frontend domain

### Step 5: Email Configuration
Set up SMTP settings in Azure App Service:
```bash
az webapp config appsettings set \
  --resource-group saferide-au-rg \
  --name your-app-name \
  --settings \
    EmailSettings__SmtpUsername="your-email@gmail.com" \
    EmailSettings__SmtpPassword="your-app-password"
```

## 💰 Expected Costs (Australia Southeast)

### Monthly Estimates (AUD):
- **App Service (Basic B1)**: ~$15-25
- **PostgreSQL (B1ms)**: ~$15-20  
- **Static Web Apps**: Free
- **Data Transfer**: ~$1-5
- **Total**: ~$31-50 AUD/month

### Free Tier Options:
- **App Service F1**: Free (limited)
- **PostgreSQL**: No free tier
- **Alternative**: Use SQLite (free but limited)

## 🔍 Deployment Status Check

```bash
# Check resource group
az group list --query "[?name=='saferide-au-rg']" --output table

# Check app service
az webapp list --resource-group saferide-au-rg --output table

# Check database
az postgres flexible-server list --resource-group saferide-au-rg --output table
```

## 🚀 Post-Deployment Tasks

1. **Test API endpoints**: `https://your-app.azurewebsites.net/swagger`
2. **Update frontend config** with real backend URL
3. **Configure authentication** redirect URIs
4. **Set up monitoring** and alerts
5. **Configure custom domain** (optional)

## 🔧 Troubleshooting

### If App Service Creation Fails:
- **Quota issues**: Try different regions (Australia East, Southeast Asia)
- **Tier limitations**: Script automatically tries lower tiers
- **Fallback**: Container Instances (more expensive but reliable)

### If Database Creation Fails:
- **Cost concerns**: PostgreSQL costs ~$15/month minimum
- **Alternative**: SQLite (included in script as fallback)
- **Shared database**: Use existing PostgreSQL instance

## 📞 Next Steps After Script Completion

1. **Note the API URL** from script output
2. **Update frontend configuration** 
3. **Add GitHub secrets** for automated deployment
4. **Test the complete application** end-to-end

The script will provide specific URLs and configuration details upon completion!
