import { isEmail } from 'validator';

export const validateEmail = (email: string): boolean => {
    return isEmail(email);
};

export const validateDrivingLicense = (license: string): boolean => {
    const licensePattern = /^[A-Z0-9]{5,}$/; // Example pattern, adjust as necessary
    return licensePattern.test(license);
};

export const validateWorkingWithChildrenCard = (card: string): boolean => {
    const cardPattern = /^[A-Z0-9]{6,}$/; // Example pattern, adjust as necessary
    return cardPattern.test(card);
};

export const validateCreditPoints = (points: number): boolean => {
    return points >= 0 && points <= 5; // Assuming max 5 credit points
};

export const validateRideOffer = (seats: number): boolean => {
    return seats > 0 && seats <= 4; // Assuming a maximum of 4 seats available for sharing
};