# Azure App Service Deployment Script
# Run this after creating your Azure resources

# Variables (update these with your actual values)
RESOURCE_GROUP="saferide-rg"
APP_SERVICE_PLAN="saferide-plan"
WEB_APP_NAME="saferide-api"
POSTGRES_SERVER="saferide-postgres"
POSTGRES_DB="saferide"
LOCATION="East US"

# Create resource group
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# Create App Service Plan
az appservice plan create --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP --sku B1 --is-linux

# Create PostgreSQL server
az postgres server create \
  --resource-group $RESOURCE_GROUP \
  --name $POSTGRES_SERVER \
  --location "$LOCATION" \
  --admin-user saferideadmin \
  --admin-password "YourSecurePassword123!" \
  --sku-name B_Gen5_1 \
  --version 11

# Create PostgreSQL database
az postgres db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $POSTGRES_SERVER \
  --name $POSTGRES_DB

# Configure firewall to allow Azure services
az postgres server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --server $POSTGRES_SERVER \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Create Web App
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --name $WEB_APP_NAME \
  --runtime "DOTNET|8.0"

# Configure connection string
CONNECTION_STRING="Host=$POSTGRES_SERVER.postgres.database.azure.com;Database=$POSTGRES_DB;Username=saferideadmin@$POSTGRES_SERVER;Password=YourSecurePassword123!;SSL Mode=Require"

az webapp config connection-string set \
  --resource-group $RESOURCE_GROUP \
  --name $WEB_APP_NAME \
  --connection-string-type PostgreSQL \
  --settings DefaultConnection="$CONNECTION_STRING"

echo "Azure resources created successfully!"
echo "Web App URL: https://$WEB_APP_NAME.azurewebsites.net"
echo "PostgreSQL Server: $POSTGRES_SERVER.postgres.database.azure.com"
