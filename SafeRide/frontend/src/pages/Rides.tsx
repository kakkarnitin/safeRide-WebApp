import React, { useState, useEffect } from 'react';
import { apiService, RideOffer as ServiceRideOffer } from '../services/apiService';
import { RideOffer } from '../types/rides';
import RideCard from '../components/rides/RideCard';
import { useAuth } from '../contexts/AuthContext';

const Rides: React.FC = () => {
    const { user } = useAuth();
    const [rides, setRides] = useState<ServiceRideOffer[]>([]);
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

    // Convert service RideOffer to component RideOffer format
    const mapToComponentFormat = (serviceRide: ServiceRideOffer): RideOffer => {
        const rideDate = new Date(serviceRide.offerDate);
        return {
            id: serviceRide.id || '',
            parentId: serviceRide.parentId,
            schoolId: '', // Not available in service type
            pickupLocation: serviceRide.pickupLocation,
            dropoffLocation: serviceRide.dropOffLocation,
            availableSeats: serviceRide.availableSeats,
            date: rideDate.toISOString().split('T')[0], // Convert to date string
            time: rideDate.toTimeString().split(' ')[0].slice(0, 5), // Convert to HH:mm format
            creditsEarned: Math.floor(Math.random() * 10) + 5 // Mock credits for now
        };
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-lg text-gray-600">Loading available rides...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-lg mb-4">{error}</div>
                    <button 
                        onClick={fetchRides}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Available Rides</h1>
                        <p className="text-gray-600 mt-1">Find and book rides in your area</p>
                    </div>
                    <button 
                        onClick={fetchRides}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md flex items-center space-x-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Refresh</span>
                    </button>
                </div>
                
                {rides.length === 0 ? (
                    <div className="text-center py-16">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No rides available</h3>
                        <p className="text-gray-600">Check back later or create your own ride offer!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {rides.map((serviceRide) => {
                            const ride = mapToComponentFormat(serviceRide);
                            const isOwnRide = serviceRide.parentId === user?.id;
                            const isBooked = bookedRides.includes(ride.id);
                            const isActive = serviceRide.isActive !== false;

                            return (
                                <div key={ride.id} className="relative">
                                    {isOwnRide && (
                                        <div className="absolute top-4 left-4 z-10 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                                            Your Offer
                                        </div>
                                    )}
                                    <RideCard 
                                        ride={ride} 
                                        onSelect={(rideId) => {
                                            if (!isOwnRide && !isBooked && isActive) {
                                                handleBookRide(rideId);
                                            }
                                        }}
                                    />
                                    {(isBooked || !isActive) && (
                                        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-xl flex items-center justify-center">
                                            <span className="bg-white px-4 py-2 rounded-lg font-medium text-gray-700">
                                                {isBooked ? 'Already Booked' : 'Unavailable'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rides;