// Add to SafeRide/frontend/src/config/environment.ts
export const config = {
  apiBaseUrl: import.meta.env.NODE_ENV === 'production' 
    ? 'https://saferide-api.azurewebsites.net/api'  // Your Azure App Service URL
    : 'http://localhost:5001/api',  // Development backend URL
  
  environment: import.meta.env.NODE_ENV || 'development',
  
  // Microsoft Authentication
  auth: {
    useAzureAD: true,
    useMockAuth: import.meta.env.VITE_USE_MOCK_AUTH === 'true' || !import.meta.env.VITE_MICROSOFT_CLIENT_ID, // Use mock auth if explicitly set or if no client ID
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
    tenantId: import.meta.env.VITE_MICROSOFT_TENANT_ID || '',
  }
};
