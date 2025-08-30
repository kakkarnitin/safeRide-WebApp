import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMicrosoftAuth } from '../contexts/MicrosoftAuthContext';
import MicrosoftLoginButton from '../components/auth/MicrosoftLoginButton';
import { config } from '../config/environment';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated: isTraditionalAuth } = useAuth();
    const { login: microsoftLogin, isAuthenticated: isMicrosoftAuthenticated } = useMicrosoftAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    // Redirect if user is already authenticated with either method
    useEffect(() => {
        if (isMicrosoftAuthenticated || isTraditionalAuth) {
            // Use setTimeout to ensure the redirect happens after render
            setTimeout(() => {
                navigate('/dashboard', { replace: true });
            }, 100);
        }
    }, [isMicrosoftAuthenticated, isTraditionalAuth, navigate]);

    // Don't show redirect message, just let the navigation happen
    // if (isMicrosoftAuthenticated || isTraditionalAuth) {
    //     console.log('Login: Authenticated user detected, showing redirect message');
    //     return (
    //         <div className="flex justify-center items-center min-h-screen">
    //             <div className="text-lg text-gray-600">Redirecting to dashboard...</div>
    //         </div>
    //     );
    // }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors([]);

        try {
            console.log('Attempting login with:', formData);
            const result = await login(formData);
            console.log('Login result:', result);
            
            if (result.success) {
                console.log('Login successful, navigating to dashboard');
                navigate('/dashboard');
            } else {
                console.log('Login failed:', result.errors);
                setErrors(result.errors || ['Login failed']);
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors(['An unexpected error occurred']);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMicrosoftLogin = async () => {
        try {
            setIsLoading(true);
            setErrors([]);
            console.log('Starting Microsoft login process...');
            
            await microsoftLogin();
            console.log('Microsoft login completed successfully');
            
            // If successful, navigate to dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('Microsoft login error:', error);
            
            let errorMessage = 'Microsoft login failed. Please try again.';
            
            // Provide more specific error messages
            if (error && typeof error === 'object') {
                const msalError = error as any;
                if (msalError.errorCode === 'user_cancelled') {
                    errorMessage = 'Login was cancelled. Please try again.';
                } else if (msalError.errorCode === 'popup_window_error') {
                    errorMessage = 'Popup was blocked. Please allow popups for this site and try again.';
                } else if (msalError.message) {
                    errorMessage = `Login failed: ${msalError.message}`;
                }
            }
            
            setErrors([errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to SafeRide
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Environment: {config.environment}
                    </p>
                </div>

                {/* Error Display */}
                {errors.length > 0 && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    There were errors with your submission
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <ul className="list-disc list-inside space-y-1">
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>

                {/* Divider */}
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>
                </div>

                {/* Microsoft Login */}
                <div className="mt-6">
                    <MicrosoftLoginButton 
                        onClick={handleMicrosoftLogin}
                        disabled={isLoading}
                    />
                </div>

                {/* Register link */}
                <div className="mt-6 text-center">
                    <Link 
                        to="/register" 
                        className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                    >
                        Don't have an account? Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
