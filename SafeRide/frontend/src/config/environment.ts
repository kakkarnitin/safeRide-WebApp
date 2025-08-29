// Add to SafeRide/frontend/src/config/environment.ts
export const config = {
  apiBaseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://saferide-api.azurewebsites.net/api'  // Your Azure App Service URL
    : 'http://localhost:5001/api',  // Development backend URL
  
  environment: process.env.NODE_ENV,
};
