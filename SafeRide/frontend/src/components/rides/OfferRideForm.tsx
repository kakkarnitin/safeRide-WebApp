import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createRideOffer } from '../../api/ridesApi';
import { useHistory } from 'react-router-dom';
import Button from '../common/Button';
import SeatSelector from './SeatSelector';

const OfferRideForm = () => {
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [availableSeats, setAvailableSeats] = useState(1);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pickupLocation || !dropoffLocation || !date || !time) {
            setError('All fields are required');
            return;
        }

        try {
            const rideOffer = {
                pickupLocation,
                dropoffLocation,
                date,
                time,
                availableSeats,
            };
            await createRideOffer(rideOffer);
            dispatch({ type: 'ADD_RIDE_OFFER', payload: rideOffer });
            history.push('/rides');
        } catch (err) {
            setError('Failed to offer ride. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Offer a Ride</h2>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mb-4">
                <label className="block mb-1">Pickup Location</label>
                <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="border rounded w-full p-2"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Dropoff Location</label>
                <input
                    type="text"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className="border rounded w-full p-2"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border rounded w-full p-2"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Time</label>
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="border rounded w-full p-2"
                    required
                />
            </div>
            <SeatSelector availableSeats={availableSeats} setAvailableSeats={setAvailableSeats} />
            <Button type="submit" className="mt-4">Offer Ride</Button>
        </form>
    );
};

export default OfferRideForm;