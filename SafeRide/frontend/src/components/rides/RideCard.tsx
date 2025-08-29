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

    return (
        <div className="bg-white shadow-md rounded-lg p-4 m-2">
            <h3 className="text-lg font-semibold">{ride.driverName}</h3>
            <p className="text-gray-600">From: {ride.pickupLocation}</p>
            <p className="text-gray-600">To: {ride.dropoffLocation}</p>
            <p className="text-gray-600">Available Seats: {ride.availableSeats}</p>
            <p className="text-gray-600">Time: {new Date(ride.time).toLocaleString()}</p>
            <button 
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={handleSelect}
            >
                Select Ride
            </button>
        </div>
    );
};

export default RideCard;