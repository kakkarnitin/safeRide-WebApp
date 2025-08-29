import axios from 'axios';
import { AuthResponse, RegisterRequest, LoginRequest } from '../types/auth';

const API_URL = 'http://localhost:5000/api/auth'; // Update with your backend API URL

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
};

export const logout = async (): Promise<void> => {
    await axios.post(`${API_URL}/logout`);
};