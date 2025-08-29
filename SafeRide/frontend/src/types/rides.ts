export interface RideOffer {
    id: string;
    parentId: string;
    schoolId: string;
    pickupLocation: string;
    dropoffLocation: string;
    availableSeats: number;
    date: string; // ISO date string
    time: string; // Time in HH:mm format
    creditsEarned: number;
}

export interface RideReservation {
    id: string;
    rideOfferId: string;
    parentId: string;
    reservedSeats: number;
    reservationDate: string; // ISO date string
}

export interface Ride {
    offer: RideOffer;
    reservations: RideReservation[];
}