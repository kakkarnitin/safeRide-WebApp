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
    parent: Parent;
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