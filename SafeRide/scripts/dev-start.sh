#!/bin/bash

# Navigate to the frontend directory and start the development server
cd frontend
npm install
npm run dev &

# Navigate to the backend directory and start the backend server
cd ../backend/src/SafeRide.Api
dotnet run