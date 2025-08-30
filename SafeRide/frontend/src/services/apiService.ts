// Base API configuration
import { config } from '../config/environment';
const API_BASE_URL = config.apiBaseUrl;

// Generic API response type
interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: string[];
  success: boolean;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  drivingLicense: string;
  workingWithChildrenCard: string;
  phoneNumber: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
}

// Ride types
export interface RideOffer {
  id?: string;
  parentId: string;
  offerDate: string;
  pickupLocation: string;
  dropOffLocation: string;
  availableSeats: number;
  isActive?: boolean;
}

// HTTP client class
class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    // Try to get token from localStorage on initialization
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          errors: data.errors || [data.message || 'An error occurred'],
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        errors: ['Network error occurred'],
      };
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<ApiResponse<{ token: string; user: User }>> {
    console.log('ApiService: Making login request to backend');
    const response = await this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    console.log('ApiService: Backend response:', response);

    if (response.success && response.data) {
      this.token = response.data.token;
      localStorage.setItem('authToken', this.token);
      console.log('ApiService: Token saved to localStorage');
    }

    return response;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Ride methods
  async getRides(): Promise<ApiResponse<RideOffer[]>> {
    return this.request<RideOffer[]>('/rides');
  }

  async offerRide(rideData: RideOffer): Promise<ApiResponse<RideOffer>> {
    return this.request<RideOffer>('/rides', {
      method: 'POST',
      body: JSON.stringify(rideData),
    });
  }

  async reserveRide(rideId: string): Promise<ApiResponse<any>> {
    return this.request(`/rides/${rideId}/reserve`, {
      method: 'POST',
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

// Export singleton instance
export const apiService = new ApiService();
