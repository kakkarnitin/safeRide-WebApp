import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        // If user is already logged in, redirect to dashboard
        navigate('/dashboard');
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
            <h1 className="text-5xl font-bold text-blue-600 mb-4">
                Welcome to SafeRide
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-md">
                Safe and reliable ride-sharing for your children's school commutes.
            </p>
            <div className="space-x-4">
                <button 
                    onClick={() => navigate('/login')}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-base hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                    Sign In
                </button>
                <button 
                    onClick={() => navigate('/register')}
                    className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold text-base hover:bg-green-600 transition-transform transform hover:scale-105"
                >
                    Create Account
                </button>
            </div>
        </div>
    );
};

export default Landing;