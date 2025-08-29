import httpClient from './httpClient';
import { RideOffer, RideReservation } from '../types/rides';

const RIDE_API_BASE_URL = '/api/rides';

export const fetchAvailableRides = async () => {
    const response = await httpClient.get<RideOffer[]>(`${RIDE_API_BASE_URL}/available`);
    return response.data;
};

export const offerRide = async (rideOffer: RideOffer) => {
    const response = await httpClient.post<RideOffer>(`${RIDE_API_BASE_URL}/offer`, rideOffer);
    return response.data;
};

export const reserveRide = async (rideId: string) => {
    const response = await httpClient.post<RideReservation>(`${RIDE_API_BASE_URL}/reserve`, { rideId });
    return response.data;
};

export const fetchUserRides = async () => {
    const response = await httpClient.get<RideOffer[]>(`${RIDE_API_BASE_URL}/user`);
    return response.data;
};