export const formatCreditPoints = (points: number): string => {
    return `${points} Credit Point${points !== 1 ? 's' : ''}`;
};

export const formatRideDetails = (ride: { date: string; time: string; seats: number }): string => {
    return `Ride on ${ride.date} at ${ride.time} with ${ride.seats} seat${ride.seats !== 1 ? 's' : ''} available.`;
};

export const formatVerificationStatus = (isVerified: boolean): string => {
    return isVerified ? 'Verified' : 'Not Verified';
};