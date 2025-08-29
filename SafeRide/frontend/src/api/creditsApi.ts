import httpClient from './httpClient';
import { CreditTransaction } from '../types/credits';

const BASE_URL = '/api/credits';

export const getCreditBalance = async (parentId: string): Promise<number> => {
    const response = await httpClient.get(`${BASE_URL}/balance/${parentId}`);
    return response.data.balance;
};

export const getCreditTransactions = async (parentId: string): Promise<CreditTransaction[]> => {
    const response = await httpClient.get(`${BASE_URL}/transactions/${parentId}`);
    return response.data.transactions;
};

export const addCreditTransaction = async (parentId: string, transaction: CreditTransaction): Promise<void> => {
    await httpClient.post(`${BASE_URL}/transactions/${parentId}`, transaction);
};