import { useEffect, useState } from 'react';
import { fetchCreditBalance, updateCreditBalance } from '../api/creditsApi';

const useCredits = (parentId) => {
    const [creditBalance, setCreditBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCreditBalance = async () => {
            try {
                const balance = await fetchCreditBalance(parentId);
                setCreditBalance(balance);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getCreditBalance();
    }, [parentId]);

    const addCredit = async () => {
        try {
            const newBalance = await updateCreditBalance(parentId, 1);
            setCreditBalance(newBalance);
        } catch (err) {
            setError(err.message);
        }
    };

    const deductCredit = async () => {
        try {
            const newBalance = await updateCreditBalance(parentId, -1);
            setCreditBalance(newBalance);
        } catch (err) {
            setError(err.message);
        }
    };

    return { creditBalance, loading, error, addCredit, deductCredit };
};

export default useCredits;