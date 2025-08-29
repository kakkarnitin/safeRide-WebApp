#!/bin/bash

# This script is used to run database migrations for the SafeRide application.

set -e

# Navigate to the backend project directory
cd ../backend/src/SafeRide.Infrastructure

# Run the migrations
dotnet ef database update

echo "Database migrations completed successfully."