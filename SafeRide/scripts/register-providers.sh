#!/bin/bash

# Azure Resource Provider Registration Script
echo "🔧 Registering Azure Resource Providers..."

# List of required providers
providers=(
    "Microsoft.Web"
    "Microsoft.DBforPostgreSQL" 
    "Microsoft.Storage"
    "Microsoft.Insights"
)

# Register each provider
for provider in "${providers[@]}"; do
    echo "📋 Registering $provider..."
    az provider register --namespace "$provider"
done

echo ""
echo "⏳ Waiting for registration to complete..."
sleep 30

echo ""
echo "📊 Registration Status:"
for provider in "${providers[@]}"; do
    state=$(az provider show --namespace "$provider" --query "registrationState" --output tsv)
    if [ "$state" = "Registered" ]; then
        echo "✅ $provider: $state"
    else
        echo "⏳ $provider: $state (may take a few minutes)"
    fi
done

echo ""
echo "💡 Note: Resource provider registration can take 5-10 minutes."
echo "   You can check status with: az provider show --namespace Microsoft.Web"
echo "   Or run the deployment script - it will wait for registration to complete."
