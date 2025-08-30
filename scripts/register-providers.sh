#!/bin/bash

# Register Azure providers for SafeRide deployment
echo "🔧 Registering Azure providers for SafeRide..."

providers=(
    "Microsoft.ContainerRegistry"
    "Microsoft.ContainerInstance" 
    "Microsoft.Storage"
    "Microsoft.Web"
    "Microsoft.Sql"
    "Microsoft.KeyVault"
    "Microsoft.Insights"
    "Microsoft.Authorization"
    "Microsoft.Resources"
)

for provider in "${providers[@]}"; do
    echo "📦 Registering $provider..."
    az provider register --namespace "$provider"
done

echo ""
echo "⏳ Waiting for registration to complete..."
sleep 30

echo ""
echo "📋 Provider Registration Status:"
echo "================================"

for provider in "${providers[@]}"; do
    status=$(az provider show --namespace "$provider" --query "registrationState" --output tsv)
    if [ "$status" = "Registered" ]; then
        echo "✅ $provider: $status"
    else
        echo "⏳ $provider: $status"
    fi
done

echo ""
echo "🎉 Provider registration completed!"
echo "Note: Some providers may still be 'Registering' - this is normal and will complete in the background."
