export interface VerificationDocument {
    id: string;
    parentId: string;
    documentType: 'DrivingLicense' | 'WorkingWithChildrenCard';
    documentUrl: string;
    status: VerificationStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface VerificationStatus {
    id: string;
    parentId: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    comments?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface VerificationResponse {
    success: boolean;
    message: string;
    document?: VerificationDocument;
}