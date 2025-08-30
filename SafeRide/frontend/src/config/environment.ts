// Environment configuration for SafeRide frontend
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.MODE === 'production' 
      ? 'http://saferide-api-37615.australiasoutheast.azurecontainer.io/api'  // Production Container Instance
      : 'http://localhost:5001/api'),  // Development backend URL
  
  environment: import.meta.env.MODE || 'development',
  
  // Microsoft Authentication
  auth: {
    useAzureAD: true,
    useMockAuth: import.meta.env.VITE_USE_MOCK_AUTH === 'true' || !import.meta.env.VITE_MICROSOFT_CLIENT_ID, // Use mock auth if explicitly set or if no client ID
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
    tenantId: import.meta.env.VITE_MICROSOFT_TENANT_ID || '',
  },

  // Features
  features: {
    enableEmailNotifications: import.meta.env.VITE_ENABLE_EMAIL_NOTIFICATIONS === 'true',
    enableAdminPanel: import.meta.env.VITE_ENABLE_ADMIN_PANEL === 'true',
  }
};
