import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMicrosoftAuth } from '../contexts/MicrosoftAuthContext';
import { apiService, RideOffer } from '../services/apiService';

interface DashboardStats {
    ridesOffered: number;
    ridesRequested: number;
    credits: number;
    verificationStatus: string;
}

const Dashboard: React.FC = () => {
    const { user: traditionalUser } = useAuth();
    const { user: microsoftUser } = useMicrosoftAuth();
    
    // Use whichever user is available (prioritize Microsoft auth)
    const user = microsoftUser || traditionalUser;
    
    const [stats, setStats] = useState<DashboardStats>({
        ridesOffered: 0,
        ridesRequested: 0,
        credits: 0,
        verificationStatus: 'Unverified',
    });
    const [recentRides, setRecentRides] = useState<RideOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Don't fetch data if no user is available yet
                if (!user) {
                    setLoading(false);
                    return;
                }

                // Fetch all rides to calculate stats
                const ridesResponse = await apiService.getRides();
                
                if (ridesResponse.success && ridesResponse.data) {
                    const allRides = ridesResponse.data;
                    
                    // Filter rides by current user
                    const userRides = allRides.filter(ride => ride.parentId === user?.id);
                    
                    // Calculate stats
                    setStats({
                        ridesOffered: userRides.length,
                        ridesRequested: 0, // This would come from ride requests API
                        credits: 100, // This would come from credits API
                        verificationStatus: 'Unverified',
                    });

                    // Set recent rides (last 5)
                    setRecentRides(userRides.slice(0, 5));
                } else {
                    throw new Error('Failed to fetch dashboard data');
                }
            } catch (err) {
                setError('Failed to load dashboard data');
                console.error('Dashboard error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-lg text-gray-600">Loading dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-lg text-red-600">{error}</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-lg text-gray-600">No user information available</div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name || user?.email || 'User'}!</h1>
                <p className="text-gray-600 mt-2">Here's your SafeRide activity overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            🚗
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Rides Offered</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.ridesOffered}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            🎯
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Rides Requested</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.ridesRequested}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            💰
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Credits</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.credits}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className={`p-3 rounded-full ${
                            stats.verificationStatus === 'Verified' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-red-100 text-red-600'
                        }`}>
                            {stats.verificationStatus === 'Verified' ? '✓' : '✗'}
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Status</p>
                            <p className="text-lg font-semibold text-gray-900">{stats.verificationStatus}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Rides</h2>
                
                {recentRides.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No rides offered yet</p>
                        <p className="text-sm mt-2">Start by offering your first ride!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentRides.map((ride) => (
                            <div key={ride.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {ride.pickupLocation} → {ride.dropOffLocation}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {new Date(ride.offerDate).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {ride.availableSeats} seat{ride.availableSeats !== 1 ? 's' : ''} available
                                        </p>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                        Offered
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
