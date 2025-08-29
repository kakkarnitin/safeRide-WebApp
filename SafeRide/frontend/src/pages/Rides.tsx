import React, { useState, useEffect } from 'react';
import { apiService, RideOffer } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

const Rides: React.FC = () => {
    const { user } = useAuth();
    const [rides, setRides] = useState<RideOffer[]>([]);
    const [bookedRides, setBookedRides] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRides();
    }, []);

    const fetchRides = async () => {
        try {
            setIsLoading(true);
            const response = await apiService.getRides();
            if (response.success && response.data) {
                setRides(response.data);
            } else {
                setError('Failed to load rides');
            }
        } catch (err) {
            setError('Failed to load rides');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBookRide = async (rideId: string) => {
        if (!rideId || bookedRides.includes(rideId)) return;

        try {
            const response = await apiService.reserveRide(rideId);
            if (response.success) {
                setBookedRides([...bookedRides, rideId]);
                alert('Ride booked successfully!');
            } else {
                alert('Failed to book ride. Please try again.');
            }
        } catch (error) {
            alert('Failed to book ride. Please try again.');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (isLoading) {
        return (
            <div className="p-10 text-center">
                <div className="text-lg">Loading rides...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center">
                <div className="text-red-600 text-lg">{error}</div>
                <button 
                    onClick={fetchRides}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Available Rides</h1>
                <button 
                    onClick={fetchRides}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Refresh
                </button>
            </div>
            
            {rides.length === 0 ? (
                <div className="text-center text-gray-600">
                    <p>No rides available at the moment.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {rides.map((ride) => (
                        <div key={ride.id} className="bg-white p-6 border rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="mb-4 sm:mb-0 flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-semibold text-gray-900">Ride #{ride.id?.slice(0, 8)}</h3>
                                    {ride.parentId === user?.id && (
                                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                            Your Offer
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600">
                                    <span className="font-medium">From:</span> {ride.pickupLocation}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">To:</span> {ride.dropOffLocation}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Date:</span> {formatDate(ride.offerDate)}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Available Seats:</span> {ride.availableSeats}
                                </p>
                            </div>
                            <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
                                {ride.parentId === user?.id ? (
                                    <span className="w-full sm:w-auto px-5 py-2 rounded-md font-semibold text-gray-600 bg-gray-100 text-center">
                                        Your Ride
                                    </span>
                                ) : (
                                    <button 
                                        onClick={() => handleBookRide(ride.id!)}
                                        disabled={bookedRides.includes(ride.id!) || !ride.isActive}
                                        className={`w-full sm:w-auto px-5 py-2 rounded-md font-semibold text-white transition-colors ${
                                            bookedRides.includes(ride.id!) 
                                                ? "bg-gray-400 cursor-not-allowed" 
                                                : !ride.isActive
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-700"
                                        }`}
                                    >
                                        {bookedRides.includes(ride.id!) 
                                            ? "Booked" 
                                            : !ride.isActive 
                                            ? "Unavailable" 
                                            : "Book Ride"
                                        }
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Rides;