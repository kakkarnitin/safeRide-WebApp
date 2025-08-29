import httpClient from './httpClient';
import { VerificationDocument } from '../types/verification';

const BASE_URL = '/api/verification';

export const uploadVerificationDocuments = async (documents: FormData) => {
    const response = await httpClient.post(`${BASE_URL}/upload`, documents);
    return response.data;
};

export const getVerificationStatus = async (parentId: string) => {
    const response = await httpClient.get(`${BASE_URL}/status/${parentId}`);
    return response.data;
};

export const verifyParent = async (parentId: string, verificationData: VerificationDocument) => {
    const response = await httpClient.post(`${BASE_URL}/verify/${parentId}`, verificationData);
    return response.data;
};