#!/bin/bash

# Ultra-Cheap SafeRide Deployment with Actual .NET Application
# Uses Azure Container Registry + Container Instances

set -e

# Get script directory for relative paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

RESOURCE_GROUP="saferide-free-rg"
LOCATION="Australia Southeast"
STORAGE_ACCOUNT="saferide$(date +%s | tail -c 8)"
ACR_NAME="saferide$(date +%s | tail -c 8)"
CONTAINER_NAME="saferide-api"

echo "💰 Starting ultra-cheap SafeRide deployment with .NET application..."

# Check if user is logged in to Azure
if ! az account show &> /dev/null; then
    echo "❌ Please login to Azure CLI first: az login"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "📦 Creating resource group..."
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

# Create Azure Container Registry (Basic tier - cheapest)
echo "📋 Creating Azure Container Registry..."
az acr create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$ACR_NAME" \
  --sku Basic \
  --admin-enabled true

# Get ACR login server
ACR_LOGIN_SERVER=$(az acr show --name "$ACR_NAME" --resource-group "$RESOURCE_GROUP" --query "loginServer" --output tsv)
ACR_PASSWORD=$(az acr credential show --name "$ACR_NAME" --resource-group "$RESOURCE_GROUP" --query "passwords[0].value" --output tsv)

echo "🔨 Building .NET application..."
cd "$SCRIPT_DIR/../../backend/src/SafeRide.Api"

# Create optimized Dockerfile
cat > Dockerfile << 'EOF'
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY ["SafeRide.Api.csproj", "SafeRide.Api/"]
COPY ["../SafeRide.Core/SafeRide.Core.csproj", "SafeRide.Core/"]
COPY ["../SafeRide.Infrastructure/SafeRide.Infrastructure.csproj", "SafeRide.Infrastructure/"]

WORKDIR "/src/SafeRide.Api"
RUN dotnet restore "SafeRide.Api.csproj"

# Copy source code
WORKDIR /src
COPY . SafeRide.Api/
COPY ../SafeRide.Core SafeRide.Core/
COPY ../SafeRide.Infrastructure SafeRide.Infrastructure/

# Build and publish
WORKDIR "/src/SafeRide.Api"
RUN dotnet build "SafeRide.Api.csproj" -c Release -o /app/build
RUN dotnet publish "SafeRide.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

# Create SQLite database directory
RUN mkdir -p /app/data

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:80
ENV ConnectionStrings__DefaultConnection="Data Source=/app/data/saferide.db"
ENV UseSQLite=true

ENTRYPOINT ["dotnet", "SafeRide.Api.dll"]
EOF

echo "🐳 Building and pushing Docker image..."
# Build the image
docker build -t "$ACR_LOGIN_SERVER/saferide-api:latest" .

# Login to ACR and push
az acr login --name "$ACR_NAME"
docker push "$ACR_LOGIN_SERVER/saferide-api:latest"

echo "☁️ Creating storage account for database persistence..."
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

echo "🚀 Deploying container with .NET application..."
az container create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$CONTAINER_NAME" \
  --image "$ACR_LOGIN_SERVER/saferide-api:latest" \
  --registry-login-server "$ACR_LOGIN_SERVER" \
  --registry-username "$ACR_NAME" \
  --registry-password "$ACR_PASSWORD" \
  --dns-name-label "saferide-api-$(date +%s | tail -c 6)" \
  --ports 80 \
  --cpu 0.5 \
  --memory 1 \
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

# Get container FQDN
FQDN=$(az container show \
  --resource-group "$RESOURCE_GROUP" \
  --name "$CONTAINER_NAME" \
  --query "ipAddress.fqdn" \
  --output tsv)

# Go back to script directory
cd "$SCRIPT_DIR"

echo ""
echo "✅ Ultra-cheap SafeRide deployment with .NET application completed!"
echo ""
echo "📋 Deployment Details:"
echo "   🐳 Container: $CONTAINER_NAME"
echo "   📋 Container Registry: $ACR_NAME"
echo "   💾 Storage: $STORAGE_ACCOUNT (SQLite database)"
echo "   🔗 API URL: http://$FQDN"
echo "   📄 Swagger UI: http://$FQDN/swagger"
echo ""
echo "💰 Cost Breakdown (Monthly estimates):"
echo "   🐳 Container Instances: ~$3-8 AUD (pay per second when running)"
echo "   📋 Container Registry: ~$6 AUD (Basic tier)"
echo "   💾 Storage Account: ~$0.50-2 AUD"
echo "   🌐 Static Web Apps: FREE"
echo "   📊 Total: ~$9.50-16 AUD/month"
echo ""
echo "⚡ Cost Optimization:"
echo "   - Container only costs when running (pay per second)"
echo "   - SQLite database (no database hosting costs)"
echo "   - Can stop container when not in use"
echo ""
echo "🔧 Container Management:"
echo "   Stop:  az container stop --resource-group $RESOURCE_GROUP --name $CONTAINER_NAME"
echo "   Start: az container start --resource-group $RESOURCE_GROUP --name $CONTAINER_NAME"
echo "   Or use: ./manage-container.sh stop|start|status"
echo ""
echo "🔄 Next Steps:"
echo "1. Test API: curl http://$FQDN/api/health (or open in browser)"
echo "2. View Swagger: http://$FQDN/swagger"
echo "3. Update frontend config to use: http://$FQDN/api"
echo "4. Stop container when not needed to save costs"
