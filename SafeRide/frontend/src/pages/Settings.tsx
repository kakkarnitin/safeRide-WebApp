import React, { useState } from 'react';
import { config } from '../config/environment';

const Settings: React.FC = () => {
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        rideReminders: true,
        systemUpdates: false
    });

    const handleNotificationChange = (key: keyof typeof notifications) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>
                        
                        {/* Environment Info */}
                        <div className="mb-8">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Environment Information</h2>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Environment
                                        </label>
                                        <div className="mt-1 text-sm text-gray-900">
                                            {config.environment}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            API URL
                                        </label>
                                        <div className="mt-1 text-sm text-gray-900">
                                            {config.apiBaseUrl}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Authentication Mode
                                        </label>
                                        <div className="mt-1 text-sm text-gray-900">
                                            {config.auth.useMockAuth ? 'Mock Authentication' : 'Microsoft Azure AD'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notification Settings */}
                        <div className="mb-8">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                                    </div>
                                    <button
                                        type="button"
                                        className={`${
                                            notifications.email ? 'bg-indigo-600' : 'bg-gray-200'
                                        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                        onClick={() => handleNotificationChange('email')}
                                    >
                                        <span
                                            className={`${
                                                notifications.email ? 'translate-x-5' : 'translate-x-0'
                                            } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                                        <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                                    </div>
                                    <button
                                        type="button"
                                        className={`${
                                            notifications.push ? 'bg-indigo-600' : 'bg-gray-200'
                                        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                        onClick={() => handleNotificationChange('push')}
                                    >
                                        <span
                                            className={`${
                                                notifications.push ? 'translate-x-5' : 'translate-x-0'
                                            } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Ride Reminders</h3>
                                        <p className="text-sm text-gray-500">Get reminded about upcoming rides</p>
                                    </div>
                                    <button
                                        type="button"
                                        className={`${
                                            notifications.rideReminders ? 'bg-indigo-600' : 'bg-gray-200'
                                        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                        onClick={() => handleNotificationChange('rideReminders')}
                                    >
                                        <span
                                            className={`${
                                                notifications.rideReminders ? 'translate-x-5' : 'translate-x-0'
                                            } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">System Updates</h3>
                                        <p className="text-sm text-gray-500">Notifications about app updates and maintenance</p>
                                    </div>
                                    <button
                                        type="button"
                                        className={`${
                                            notifications.systemUpdates ? 'bg-indigo-600' : 'bg-gray-200'
                                        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                        onClick={() => handleNotificationChange('systemUpdates')}
                                    >
                                        <span
                                            className={`${
                                                notifications.systemUpdates ? 'translate-x-5' : 'translate-x-0'
                                            } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => {
                                    // TODO: Implement save functionality
                                    alert('Settings saved! (This is a placeholder)');
                                }}
                            >
                                Save Changes
                            </button>
                        </div>

                        {/* Info Notice */}
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
                                            Settings Page
                                        </h3>
                                        <div className="mt-2 text-sm text-blue-700">
                                            <p>
                                                This is a placeholder settings page. Future versions will include 
                                                preferences for notifications, privacy settings, account management, and more.
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

export default Settings;
