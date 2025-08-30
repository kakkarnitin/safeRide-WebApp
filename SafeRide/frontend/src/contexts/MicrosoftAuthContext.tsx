import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  PublicClientApplication, 
  AccountInfo, 
  AuthenticationResult,
  InteractionStatus 
} from '@azure/msal-browser';
import { MsalProvider, useMsal, useIsAuthenticated, useAccount } from '@azure/msal-react';
import { msalConfig, loginRequest } from '../config/authConfig';
import { config } from '../config/environment';
import { microsoftAuth } from '../api/authApi';

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL to handle popup redirects
msalInstance.initialize().then(() => {
  console.log('MSAL instance initialized');
  
  // Check if there are any cached accounts
  const accounts = msalInstance.getAllAccounts();
  console.log('Cached accounts found:', accounts.length, accounts);
  
  // Handle redirect promise to process popup redirects
  msalInstance.handleRedirectPromise().then((result) => {
    console.log('Redirect promise handled:', result);
    if (result) {
      console.log('Redirect result account:', result.account);
    }
  }).catch((error) => {
    console.error('Error handling redirect promise:', error);
  });
}).catch((error) => {
  console.error('Error initializing MSAL:', error);
});

// Microsoft Graph API helper
const callMsGraph = async (accessToken: string) => {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;
  
  headers.append('Authorization', bearer);
  
  const options = {
    method: 'GET',
    headers: headers
  };
  
  return fetch('https://graph.microsoft.com/v1.0/me', options)
    .then(response => response.json())
    .catch(error => console.log(error));
};

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  microsoftId?: string;
}

interface MicrosoftAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const MicrosoftAuthContext = createContext<MicrosoftAuthContextType | undefined>(undefined);

// Mock authentication for development
const useMockAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'test@example.com',
      name: 'Test Parent',
      microsoftId: 'mock-microsoft-id'
    };
    
    setUser(mockUser);
    setIsLoading(false);
  };

  const logout = async () => {
    setUser(null);
  };

  const getAccessToken = async () => {
    return 'mock-access-token';
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    getAccessToken
  };
};

// Real Microsoft authentication
const useRealMicrosoftAuth = () => {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const account = useAccount(accounts[0] || {}) as AccountInfo;
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Start with false, only set to true during actual operations

  // Check for existing authentication on initialization
  useEffect(() => {
    const checkExistingAuth = async () => {
      console.log('Checking for existing authentication...');
      const allAccounts = instance.getAllAccounts();
      console.log('All accounts on initialization:', allAccounts);
      
      if (allAccounts.length > 0 && !user) {
        console.log('Found existing account, will process in main auth effect');
      }
    };
    
    checkExistingAuth();
  }, [instance]); // Only run once on mount

  // Initialize loading state based on MSAL interaction status
  useEffect(() => {
    console.log('MSAL interaction status changed:', inProgress);
    console.log('MSAL accounts:', accounts);
    console.log('MSAL isAuthenticated:', isAuthenticated);
    
    // Only show loading during login process, not during other interactions
    if (inProgress === InteractionStatus.Login) {
      console.log('Setting loading to true due to login in progress');
      setIsLoading(true);
    } else if (inProgress === InteractionStatus.None) {
      console.log('MSAL interaction completed');
      // Only set loading to false if we're not in the middle of our own authentication process
      // This prevents the loading state from being cleared too early
      if (!isLoading) {
        setIsLoading(false);
      }
    }
  }, [inProgress, accounts, isAuthenticated]);

  useEffect(() => {
    console.log('Microsoft Auth Context - Authentication state changed:', {
      isAuthenticated,
      account: account?.username,
      hasUser: !!user,
      inProgress
    });
    
    if (isAuthenticated && account && !user) {
      // Get user profile and authenticate with backend
      const authenticateWithBackend = async () => {
        try {
          setIsLoading(true);
          console.log('User is authenticated, processing...', { account, isAuthenticated });
          
          // Get access token for Microsoft Graph
          const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account: account
          });
          
          console.log('Token response:', {
            hasAccessToken: !!response.accessToken,
            hasIdToken: !!response.idToken,
            accessTokenPreview: response.accessToken?.substring(0, 50) + '...',
            idTokenPreview: response.idToken?.substring(0, 50) + '...'
          });
          
          // Get user profile from Microsoft Graph
          const profile = await callMsGraph(response.accessToken);
          console.log('Microsoft Graph profile:', profile);
          
          // Call our backend API with the ID token
          try {
            console.log('Calling backend with ID token...');
            const backendResponse = await microsoftAuth(response.idToken);
            console.log('Backend response:', backendResponse);
            
            // Backend returns AuthResponse directly
            const userData: User = {
              id: backendResponse.user.id,
              email: backendResponse.user.email,
              name: backendResponse.user.name,
              microsoftId: account.homeAccountId
            };
            
            console.log('Setting user data from backend:', userData);
            setUser(userData);
          } catch (backendError) {
            console.error('Backend API error:', backendError);
            
            // Fallback: create user object from Microsoft data
            const userData: User = {
              id: account.localAccountId,
              email: account.username,
              name: account.name || profile.displayName || 'Unknown User',
              microsoftId: account.homeAccountId
            };
            
            console.log('Using fallback user data:', userData);
            setUser(userData);
          }
        } catch (error) {
          console.error('Error during authentication process:', error);
        } finally {
          console.log('Authentication process completed, setting loading to false');
          setIsLoading(false);
        }
      };
      
      authenticateWithBackend();
    } else if (!isAuthenticated) {
      setUser(null);
      setIsLoading(false); // Ensure loading is false when not authenticated
    }
  }, [isAuthenticated, account, instance, user]);

  const login = async () => {
    try {
      setIsLoading(true);
      console.log('Starting Microsoft login popup...');
      
      const result = await instance.loginPopup({
        ...loginRequest,
        prompt: 'select_account' // Force account selection to avoid cached issues
      });
      
      console.log('Login popup completed successfully:', result);
    } catch (error) {
      console.error('Login failed:', error);
      
      // Check if it's a popup blocker or user cancellation
      if (error && typeof error === 'object' && 'errorCode' in error) {
        const msalError = error as any;
        if (msalError.errorCode === 'popup_window_error' || msalError.errorCode === 'user_cancelled') {
          console.log('User cancelled login or popup was blocked');
        }
      }
      
      throw error; // Re-throw so calling components can handle it
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await instance.logoutPopup({
        postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri || undefined,
        mainWindowRedirectUri: msalConfig.auth.postLogoutRedirectUri || undefined
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (!account) return null;
    
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: account
      });
      return response.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoading, // Only use our internal loading state
    login,
    logout,
    getAccessToken
  };
};

// Mock Auth provider component
const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authValue = useMockAuth();
  return (
    <MicrosoftAuthContext.Provider value={authValue}>
      {children}
    </MicrosoftAuthContext.Provider>
  );
};

// Real Auth provider component (requires MSAL wrapper)
const RealAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authValue = useRealMicrosoftAuth();
  return (
    <MicrosoftAuthContext.Provider value={authValue}>
      {children}
    </MicrosoftAuthContext.Provider>
  );
};

// Main wrapper component
export const MicrosoftAuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (config.auth.useMockAuth) {
    // In development, use mock auth provider without MSAL
    return <MockAuthProvider>{children}</MockAuthProvider>;
  }

  // In production, use MSAL wrapper with real auth provider
  return (
    <MsalProvider instance={msalInstance}>
      <RealAuthProvider>{children}</RealAuthProvider>
    </MsalProvider>
  );
};

// Hook to use the Microsoft auth context
export const useMicrosoftAuth = () => {
  const context = useContext(MicrosoftAuthContext);
  if (context === undefined) {
    throw new Error('useMicrosoftAuth must be used within a MicrosoftAuthProvider');
  }
  return context;
};

export { msalInstance, MicrosoftAuthWrapper as MicrosoftAuthProvider };
