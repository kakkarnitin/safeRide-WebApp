import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { CreditBalanceProps } from '../../types/credits';

const CreditBalance: React.FC<CreditBalanceProps> = () => {
    const creditPoints = useSelector((state: RootState) => state.credits.points);

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold">Credit Balance</h2>
            <p className="text-2xl font-bold">{creditPoints} Points</p>
            <p className="text-gray-600">You can earn and spend points by offering and using rides.</p>
        </div>
    );
};

export default CreditBalance;