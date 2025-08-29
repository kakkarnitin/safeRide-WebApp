export interface CreditTransaction {
    id: string;
    parentId: string;
    transactionType: 'credit' | 'debit';
    amount: number;
    createdAt: Date;
}

export interface CreditBalance {
    parentId: string;
    balance: number;
    transactions: CreditTransaction[];
}