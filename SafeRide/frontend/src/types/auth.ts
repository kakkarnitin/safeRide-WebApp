export interface Parent {
    id: string;
    name: string;
    email: string;
    phone: string;
    drivingLicense: string;
    workingWithChildrenCard: string;
    isVerified: boolean;
    creditPoints: number;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        isVerified: boolean;
        provider?: string;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    errors?: string[];
}

export interface RegisterRequest {
    name: string;
    email: string;
    phone: string;
    drivingLicense: string;
    workingWithChildrenCard: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}