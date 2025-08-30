#!/bin/bash

# SafeRide Container Management Script
# Easy start/stop to control costs

RESOURCE_GROUP="saferide-free-rg"
CONTAINER_NAME="saferide-api"

show_status() {
    echo "🔍 Checking SafeRide container status..."
    STATUS=$(az container show --resource-group "$RESOURCE_GROUP" --name "$CONTAINER_NAME" --query "instanceView.state" --output tsv 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo "   Status: $STATUS"
        if [ "$STATUS" = "Running" ]; then
            FQDN=$(az container show --resource-group "$RESOURCE_GROUP" --name "$CONTAINER_NAME" --query "ipAddress.fqdn" --output tsv)
            echo "   URL: http://$FQDN"
            echo "   💰 Currently billing (pay-per-second)"
        else
            echo "   💰 Not billing - container is stopped"
        fi
    else
        echo "   ❌ Container not found or not deployed yet"
    fi
}

start_container() {
    echo "🚀 Starting SafeRide container..."
    az container start --resource-group "$RESOURCE_GROUP" --name "$CONTAINER_NAME"
    echo "✅ Container started - now billing pay-per-second"
    show_status
}

stop_container() {
    echo "⏹️  Stopping SafeRide container..."
    az container stop --resource-group "$RESOURCE_GROUP" --name "$CONTAINER_NAME"
    echo "✅ Container stopped - billing paused"
    show_status
}

show_costs() {
    echo "💰 Current month's estimated costs:"
    az consumption usage list --resource-group "$RESOURCE_GROUP" --output table 2>/dev/null || echo "   Run 'az login' to see costs"
}

case "$1" in
    start)
        start_container
        ;;
    stop)
        stop_container
        ;;
    status)
        show_status
        ;;
    costs)
        show_costs
        ;;
    *)
        echo "SafeRide Container Management"
        echo ""
        echo "Usage: $0 {start|stop|status|costs}"
        echo ""
        echo "Commands:"
        echo "  start   - Start container (begins billing)"
        echo "  stop    - Stop container (stops billing)"
        echo "  status  - Check current status and URL"
        echo "  costs   - Show current month's costs"
        echo ""
        echo "Examples:"
        echo "  $0 start    # Start for demo/development"
        echo "  $0 stop     # Stop to save money"
        echo "  $0 status   # Check if running"
        ;;
esac
