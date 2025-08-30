import React from 'react';
import { RideOffer } from '../../types/rides';

interface RideCardProps {
    ride: RideOffer;
    onSelect: (rideId: string) => void;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onSelect }) => {
    const handleSelect = () => {
        onSelect(ride.id);
    };

    // Format the date and time for better readability
    const formatDateTime = (date: string, time: string) => {
        const rideDate = new Date(date);
        return {
            date: rideDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            }),
            time: time // Already in HH:mm format
        };
    };

    const { date, time } = formatDateTime(ride.date, ride.time);

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Available Ride</h3>
                        <p className="text-sm text-gray-500">
                            <span className="font-medium text-blue-600">{ride.creditsEarned}</span> credits
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-medium text-gray-600">{date}</div>
                    <div className="text-lg font-bold text-blue-600">{time}</div>
                </div>
            </div>

            {/* Route Section */}
            <div className="mb-4">
                <div className="flex items-start space-x-3">
                    <div className="flex flex-col items-center mt-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="w-0.5 h-6 bg-gray-300 my-1"></div>
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h4a1 1 0 011 1v2a1 1 0 01-1 1h-4v8a1 1 0 01-1-1H9a1 1 0 01-1-1v-8H4a1 1 0 01-1-1V8a1 1 0 011-1h4z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-500">PICKUP</span>
                            </div>
                            <p className="text-gray-900 font-medium ml-6">{ride.pickupLocation}</p>
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-500">DROP-OFF</span>
                            </div>
                            <p className="text-gray-900 font-medium ml-6">{ride.dropoffLocation}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Seats and Action */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">{ride.availableSeats}</span> seats available
                    </span>
                </div>
                <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                    onClick={handleSelect}
                >
                    <span>Book Ride</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default RideCard;