#!/bin/bash

# Ultra-Low-Cost SafeRide Deployment with actual .NET application
# Uses free/minimal cost Azure services

set -e

# Get script directory for relative paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

RESOURCE_GROUP="saferide-free-rg"
LOCATION="Australia Southeast"
STORAGE_ACCOUNT="saferide$(date +%s | tail -c 8)"
CONTAINER_GROUP="saferide-containers"

echo "💰 Starting ultra-low-cost SafeRide deployment with .NET application..."

# Check if user is logged in to Azure
if ! az account show &> /dev/null; then
    echo "❌ Please login to Azure CLI first: az login"
    exit 1
fi

echo "📦 Creating resource group..."
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

# Option 1: Azure Container Instances (Pay per second)
echo "🐳 Creating Azure Container Instances (Pay-per-use)..."

# Create storage account for database persistence (very cheap)
az storage account create \
  --name "$STORAGE_ACCOUNT" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --sku Standard_LRS \
  --kind StorageV2

# Get storage key
STORAGE_KEY=$(az storage account keys list \
  --resource-group "$RESOURCE_GROUP" \
  --account-name "$STORAGE_ACCOUNT" \
  --query '[0].value' \
  --output tsv)

# Create file share for SQLite database
az storage share create \
  --name "saferide-data" \
  --account-name "$STORAGE_ACCOUNT" \
  --account-key "$STORAGE_KEY"

# Create container with actual .NET application
echo "🐳 Building and deploying .NET application to Container Instance..."

# First, we need to build the .NET app locally and create a deployment package
echo "🔨 Building .NET application..."
cd "$SCRIPT_DIR/../../backend/src/SafeRide.Api"

# Restore and build the application
dotnet restore
dotnet build --configuration Release --no-restore
dotnet publish --configuration Release --output ./publish --no-build

# Create a simple startup script for the container
cat > ./publish/start.sh << 'EOF'
#!/bin/bash
cd /app
export ASPNETCORE_ENVIRONMENT=Production
export ASPNETCORE_URLS=http://+:80
export ConnectionStrings__DefaultConnection="Data Source=/data/saferide.db"
export UseSQLite=true
dotnet SafeRide.Api.dll
EOF

chmod +x ./publish/start.sh

# Create Dockerfile for the container
cat > ./publish/Dockerfile << 'EOF'
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY . .
EXPOSE 80
RUN chmod +x start.sh
ENTRYPOINT ["./start.sh"]
EOF

# Build container image locally
echo "🐳 Building container image..."
cd ./publish
docker build -t saferide-api .

# Create a tar file of the application
echo "📦 Creating deployment package..."
tar -czf ../saferide-app.tar.gz .
cd ..

echo "⬆️ Uploading application to Azure..."
# Upload the application files to Azure File Share
az storage file upload-batch \
  --destination "saferide-data" \
  --source "./publish" \
  --account-name "$STORAGE_ACCOUNT" \
  --account-key "$STORAGE_KEY" \
  --destination-path "app"

# Create container with .NET runtime and mount the application
az container create \
  --resource-group "$RESOURCE_GROUP" \
  --name "saferide-api" \
  --image "mcr.microsoft.com/dotnet/aspnet:9.0" \
  --dns-name-label "saferide-api-$(date +%s | tail -c 6)" \
  --ports 80 \
  --cpu 0.5 \
  --memory 1 \
  --command-line "/bin/bash -c 'cd /data/app && chmod +x start.sh && ./start.sh'" \
  --environment-variables \
    ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_URLS=http://+:80 \
    ConnectionStrings__DefaultConnection="Data Source=/data/saferide.db" \
    UseSQLite=true \
  --azure-file-volume-account-name "$STORAGE_ACCOUNT" \
  --azure-file-volume-account-key "$STORAGE_KEY" \
  --azure-file-volume-share-name "saferide-data" \
  --azure-file-volume-mount-path "/data" \
  --restart-policy OnFailure

# Go back to script directory
cd "$SCRIPT_DIR"

# Get container FQDN
FQDN=$(az container show \
  --resource-group "$RESOURCE_GROUP" \
  --name "saferide-api" \
  --query "ipAddress.fqdn" \
  --output tsv)

echo ""
echo "✅ Ultra-low-cost deployment completed!"
echo ""
echo "📋 Deployment Details:"
echo "   🐳 Container: saferide-api"
echo "   💾 Storage: $STORAGE_ACCOUNT (SQLite database)"
echo "   🔗 API URL: http://$FQDN"
echo ""
echo "💰 Cost Breakdown (Monthly estimates):"
echo "   🐳 Container Instances: ~$3-8 AUD (pay per second when running)"
echo "   💾 Storage Account: ~$0.50-2 AUD"
echo "   🌐 Static Web Apps: FREE"
echo "   📊 Total: ~$3.50-10 AUD/month"
echo ""
echo "⚡ Cost Optimization Tips:"
echo "   - Container only runs when needed (pay per second)"
echo "   - SQLite database (no database hosting costs)"
echo "   - Minimal CPU/Memory allocation"
echo "   - Can be stopped when not in use"
echo ""
echo "🔧 To stop container (stop billing): az container stop --resource-group $RESOURCE_GROUP --name saferide-api"
echo "🔧 To start container: az container start --resource-group $RESOURCE_GROUP --name saferide-api"
