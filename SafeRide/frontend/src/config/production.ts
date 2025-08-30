// Production environment configuration for Azure Static Web Apps
export const environment = {
  production: true,
  apiUrl: 'http://saferide-api-39031.australiasoutheast.azurecontainer.io/api', // Updated to current Container Instance
  microsoftAuth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || 'your-azure-ad-client-id',
    tenantId: 'consumers',
    redirectUri: 'https://calm-stone-0187f440f.2.azurestaticapps.net',
  },
  features: {
    enableEmailNotifications: true,
    enableMicrosoftAuth: true,
    enableAdminPanel: true,
  }
};

// Development environment configuration
export const developmentEnvironment = {
  production: false,
  apiUrl: 'http://localhost:5001/api',
  microsoftAuth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
    tenantId: 'consumers',
    redirectUri: 'http://localhost:5173',
  },
  features: {
    enableEmailNotifications: false,
    enableMicrosoftAuth: true,
    enableAdminPanel: true,
  }
};

// Export the appropriate environment
export const config = import.meta.env.PROD ? environment : developmentEnvironment;
