import { Configuration, PopupRequest } from '@azure/msal-browser';

// MSAL configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || 'mock-client-id', // Application (client) ID
    authority: 'https://login.microsoftonline.com/consumers', // For personal Microsoft accounts
    redirectUri: import.meta.env.NODE_ENV === 'production' 
      ? 'https://kakkarnitin.github.io/safeRide-WebApp/' 
      : window.location.origin, // Use current origin to handle any port
    postLogoutRedirectUri: import.meta.env.NODE_ENV === 'production'
      ? 'https://kakkarnitin.github.io/safeRide-WebApp/'
      : window.location.origin, // Use current origin to handle any port
  },
  cache: {
    cacheLocation: 'localStorage', // Cache location
    storeAuthStateInCookie: false, // Set to true for IE11 or Edge
  },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest: PopupRequest = {
  scopes: ['User.Read', 'profile', 'email', 'openid'],
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  graphProfilePhotoEndpoint: 'https://graph.microsoft.com/v1.0/me/photo/$value',
};

// Scopes for accessing Microsoft Graph
export const graphScopes = {
  graphUserRead: ['User.Read'],
};
