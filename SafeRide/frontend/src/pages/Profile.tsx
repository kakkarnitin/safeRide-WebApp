import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMicrosoftAuth } from '../contexts/MicrosoftAuthContext';

const Profile: React.FC = () => {
    const { user } = useAuth();
    const { user: microsoftUser, isAuthenticated: isMicrosoftAuth } = useMicrosoftAuth();
    
    const currentUser = microsoftUser || user;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center space-x-5">
                            <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-medium">
                                {currentUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {currentUser?.name || 'User Profile'}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {currentUser?.email || 'No email available'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {isMicrosoftAuth ? 'Microsoft Account' : 'Local Account'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="mt-8">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <div className="mt-1 text-sm text-gray-900">
                                        {currentUser?.name || 'Not specified'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>
                                    <div className="mt-1 text-sm text-gray-900">
                                        {currentUser?.email || 'Not specified'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        User ID
                                    </label>
                                    <div className="mt-1 text-sm text-gray-900">
                                        {currentUser?.id || 'Not available'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Account Type
                                    </label>
                                    <div className="mt-1 text-sm text-gray-900">
                                        {isMicrosoftAuth ? 'Microsoft Azure AD' : 'Local SafeRide Account'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-blue-800">
                                            Profile Page
                                        </h3>
                                        <div className="mt-2 text-sm text-blue-700">
                                            <p>
                                                This is a placeholder profile page. Future versions will include profile editing, 
                                                verification status, and more detailed user information.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
