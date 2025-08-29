import { useEffect, useState } from 'react';
import { getRides, offerRide, reserveRide } from '../api/ridesApi';
import { RideOffer, RideReservation } from '../types/rides';

const useRides = () => {
    const [rides, setRides] = useState<RideOffer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRides = async () => {
            try {
                setLoading(true);
                const fetchedRides = await getRides();
                setRides(fetchedRides);
            } catch (err) {
                setError('Failed to fetch rides');
            } finally {
                setLoading(false);
            }
        };

        fetchRides();
    }, []);

    const createRideOffer = async (rideOffer: RideOffer) => {
        try {
            const newRide = await offerRide(rideOffer);
            setRides((prevRides) => [...prevRides, newRide]);
        } catch (err) {
            setError('Failed to offer ride');
        }
    };

    const bookRide = async (rideId: string, reservation: RideReservation) => {
        try {
            await reserveRide(rideId, reservation);
            setRides((prevRides) => 
                prevRides.map(ride => 
                    ride.id === rideId ? { ...ride, seatsAvailable: ride.seatsAvailable - 1 } : ride
                )
            );
        } catch (err) {
            setError('Failed to reserve ride');
        }
    };

    return {
        rides,
        loading,
        error,
        createRideOffer,
        bookRide,
    };
};

export default useRides;