import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { config } from '../config/environment';
import LocationSearch from '../components/common/LocationSearch';
import LandmarkInput from '../components/common/LandmarkInput';

const OfferRide: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [formData, setFormData] = useState({
        schoolId: '',
        pickupLocation: '',
        pickupLandmark: '',
        dropOffLocation: '',
        dropOffLandmark: '',
        offerDate: '',
        availableSeats: 1,
    });

    const [approvedSchools, setApprovedSchools] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        fetchApprovedSchools();
    }, []);

    const fetchApprovedSchools = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/schools/approved-schools`);
            if (response.ok) {
                const schools = await response.json();
                setApprovedSchools(schools);
            } else {
                console.error('Failed to fetch approved schools:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to fetch approved schools:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'availableSeats' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors([]);

        try {
            if (!formData.schoolId) {
                setErrors(['Please select a school']);
                return;
            }

            const rideData = {
                parentId: user?.id || '1', // Use actual user ID from auth context
                schoolId: parseInt(formData.schoolId),
                pickupLocation: formData.pickupLandmark 
                    ? `${formData.pickupLocation} (${formData.pickupLandmark})`
                    : formData.pickupLocation,
                dropOffLocation: formData.dropOffLandmark 
                    ? `${formData.dropOffLocation} (${formData.dropOffLandmark})`
                    : formData.dropOffLocation,
                offerDate: formData.offerDate,
                availableSeats: formData.availableSeats,
            };

            const response = await apiService.offerRide(rideData);
            
            if (response.success) {
                alert('Ride offered successfully!');
                navigate('/rides');
            } else {
                setErrors(response.errors || ['Failed to offer ride']);
            }
        } catch (error) {
            setErrors(['An unexpected error occurred']);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                Offer a Ride
            </h2>
            
            {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                    <div className="text-sm text-red-600">
                        {errors.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
                {approvedSchools.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <div className="text-sm text-yellow-600">
                            <p className="font-medium">No approved schools found</p>
                            <p>You need to be enrolled and approved by at least one school to offer rides.</p>
                            <p className="mt-2">
                                <a href="/school-enrollment" className="text-yellow-700 underline">
                                    Go to School Enrollment →
                                </a>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 mb-1">
                            Select School
                        </label>
                        <select
                            id="schoolId"
                            name="schoolId"
                            value={formData.schoolId}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Choose a school...</option>
                            {approvedSchools.map((school) => (
                                <option key={school.id} value={school.id}>
                                    {school.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            You can only offer rides for schools where you're approved
                        </p>
                    </div>
                )}

                <LocationSearch
                    label="Pickup Location"
                    placeholder="Start typing an address..."
                    value={formData.pickupLocation}
                    onChange={(location) => setFormData(prev => ({ ...prev, pickupLocation: location }))}
                    required
                />

                <LandmarkInput
                    label="Pickup Landmark (Optional)"
                    placeholder="e.g., Near the school gate, Big oak tree"
                    value={formData.pickupLandmark}
                    onChange={(landmark) => setFormData(prev => ({ ...prev, pickupLandmark: landmark }))}
                />

                <LocationSearch
                    label="Drop-off Location"
                    placeholder="Start typing an address..."
                    value={formData.dropOffLocation}
                    onChange={(location) => setFormData(prev => ({ ...prev, dropOffLocation: location }))}
                    required
                />

                <LandmarkInput
                    label="Drop-off Landmark (Optional)"
                    placeholder="e.g., Main entrance, Parking lot entrance"
                    value={formData.dropOffLandmark}
                    onChange={(landmark) => setFormData(prev => ({ ...prev, dropOffLandmark: landmark }))}
                />

                <div>
                    <label htmlFor="offerDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Date & Time
                    </label>
                    <input
                        type="datetime-local"
                        id="offerDate"
                        name="offerDate"
                        value={formData.offerDate}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700 mb-1">
                        Available Seats
                    </label>
                    <select
                        id="availableSeats"
                        name="availableSeats"
                        value={formData.availableSeats}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || approvedSchools.length === 0}
                    className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
                        isSubmitting || approvedSchools.length === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }`}
                >
                    {isSubmitting ? 'Submitting...' : 'Offer Ride'}
                </button>
            </form>
        </div>
    );
};

export default OfferRide;