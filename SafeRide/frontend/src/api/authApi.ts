import axios from 'axios';
import { AuthResponse, RegisterRequest, LoginRequest } from '../types/auth';
import { config } from '../config/environment';

const API_URL = `${config.apiBaseUrl}/auth`; // Use environment-based URL

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
};

export const microsoftAuth = async (idToken: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/microsoft`, {}, {
        headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

export const logout = async (): Promise<void> => {
    await axios.post(`${API_URL}/logout`);
};