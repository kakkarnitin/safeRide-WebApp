#!/bin/bash

# Deploy Backend API to Azure Container Instances with .NET 9.0 support
set -e

RESOURCE_GROUP="saferide-static-rg"
CONTAINER_NAME="saferide-api"
IMAGE_NAME="mcr.microsoft.com/dotnet/samples:aspnetapp"  # Temporary placeholder
LOCATION="East US 2"

echo "🚀 Deploying SafeRide Backend API to Azure Container Instances..."

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    echo "❌ Please login to Azure CLI first: az login"
    exit 1
fi

# Create or update container instance
echo "🐳 Creating/updating container instance..."

# For now, create a simple container that can be updated later with your actual API
az container create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$CONTAINER_NAME" \
  --image "nginx:alpine" \
  --dns-name-label "saferide-api-$(date +%s | tail -c 6)" \
  --ports 80 \
  --cpu 0.5 \
  --memory 1 \
  --environment-variables \
    ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_URLS=http://+:80 \
  --restart-policy Always

# Get the container FQDN
FQDN=$(az container show \
  --resource-group "$RESOURCE_GROUP" \
  --name "$CONTAINER_NAME" \
  --query "ipAddress.fqdn" \
  --output tsv)

echo "✅ Container instance created successfully!"
echo ""
echo "📋 Backend API Details:"
echo "   - Resource Group: $RESOURCE_GROUP"
echo "   - Container Name: $CONTAINER_NAME"
echo "   - Public URL: http://$FQDN"
echo ""
echo "📋 Next Steps:"
echo "1. Update your frontend environment configuration:"
echo "   - Set API URL to: http://$FQDN"
echo ""
echo "2. To deploy your actual .NET 9.0 API later:"
echo "   - Build Docker image locally"
echo "   - Push to Azure Container Registry"
echo "   - Update container instance with new image"
echo ""
echo "💡 This approach separates frontend (Static Web Apps) from backend (Container Instances)"
echo "   allowing you to use .NET 9.0 for the backend without limitations."
