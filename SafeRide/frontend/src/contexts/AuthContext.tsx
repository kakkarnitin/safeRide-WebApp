import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User, LoginRequest, RegisterRequest } from '../services/apiService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; errors?: string[] }>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; errors?: string[] }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const token = apiService.getToken();
    if (token) {
      // In a real app, you'd verify the token with the backend
      // For now, we'll assume it's valid if it exists
      setUser({
        id: '1',
        email: 'user@example.com',
        name: 'Current User',
        isVerified: true,
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      console.log('AuthContext: Attempting login with apiService');
      const response = await apiService.login(credentials);
      console.log('AuthContext: API response:', response);
      
      if (response.success && response.data) {
        console.log('AuthContext: Setting user:', response.data.user);
        setUser(response.data.user);
        return { success: true };
      } else {
        console.log('AuthContext: Login failed:', response.errors);
        return { success: false, errors: response.errors };
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      return { success: false, errors: ['Login failed'] };
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const response = await apiService.register(userData);
      if (response.success) {
        return { success: true };
      } else {
        return { success: false, errors: response.errors };
      }
    } catch (error) {
      return { success: false, errors: ['Registration failed'] };
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
