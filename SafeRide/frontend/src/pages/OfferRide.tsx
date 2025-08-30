import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { config } from '../config/environment';
import LocationSearch from '../components/common/LocationSearch';
import LandmarkInput from '../components/common/LandmarkInput';
import DateTimePicker from '../components/common/DateTimePicker';

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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Offer a Ride
                    </h1>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Share your journey and help fellow parents while earning credits for your SafeRide account.
                    </p>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {errors.length > 0 && (
                        <div className="bg-red-50 border-b border-red-100 p-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-red-800 mb-1">
                                        Please fix the following errors:
                                    </h3>
                                    <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                        {approvedSchools.length === 0 ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                                <svg className="w-12 h-12 text-amber-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <h3 className="text-lg font-medium text-amber-800 mb-2">No approved schools found</h3>
                                <p className="text-amber-700 mb-4">
                                    You need to be enrolled and approved by at least one school to offer rides.
                                </p>
                                <a 
                                    href="/school-enrollment" 
                                    className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors font-medium"
                                >
                                    Go to School Enrollment
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* School Selection */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        School Information
                                    </h2>
                                    <div>
                                        <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 mb-2">
                                            Select School
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="schoolId"
                                                name="schoolId"
                                                value={formData.schoolId}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white appearance-none cursor-pointer"
                                            >
                                                <option value="">Choose a school...</option>
                                                {approvedSchools.map((school) => (
                                                    <option key={school.id} value={school.id}>
                                                        {school.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {/* Custom dropdown arrow */}
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">
                                            You can only offer rides for schools where you're approved
                                        </p>
                                    </div>
                                </div>

                                {/* Location Information */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                        <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Route Details
                                    </h2>
                                    <div className="space-y-6">
                                        {/* Pickup Section */}
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                                            <h3 className="text-base font-semibold text-green-800 mb-4 flex items-center">
                                                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h4a1 1 0 011 1v2a1 1 0 01-1 1h-4v8a1 1 0 01-1 1H9a1 1 0 01-1-1v-8H4a1 1 0 01-1-1V8a1 1 0 011-1h4z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                                Pickup Point
                                            </h3>
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                                <div className="lg:col-span-2">
                                                    <LocationSearch
                                                        label="Pickup Location"
                                                        placeholder="Start typing an address..."
                                                        value={formData.pickupLocation}
                                                        onChange={(location) => setFormData(prev => ({ ...prev, pickupLocation: location }))}
                                                        required
                                                    />
                                                </div>
                                                <div className="lg:col-span-1">
                                                    <LandmarkInput
                                                        label="Landmark (Optional)"
                                                        placeholder="e.g., School gate"
                                                        value={formData.pickupLandmark}
                                                        onChange={(landmark) => setFormData(prev => ({ ...prev, pickupLandmark: landmark }))}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Drop-off Section */}
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                                            <h3 className="text-base font-semibold text-red-800 mb-4 flex items-center">
                                                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Drop-off Point
                                            </h3>
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                                <div className="lg:col-span-2">
                                                    <LocationSearch
                                                        label="Drop-off Location"
                                                        placeholder="Start typing an address..."
                                                        value={formData.dropOffLocation}
                                                        onChange={(location) => setFormData(prev => ({ ...prev, dropOffLocation: location }))}
                                                        required
                                                    />
                                                </div>
                                                <div className="lg:col-span-1">
                                                    <LandmarkInput
                                                        label="Landmark (Optional)"
                                                        placeholder="e.g., Main gate"
                                                        value={formData.dropOffLandmark}
                                                        onChange={(landmark) => setFormData(prev => ({ ...prev, dropOffLandmark: landmark }))}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Trip Details */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Trip Details
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <DateTimePicker
                                            label="Date & Time"
                                            value={formData.offerDate}
                                            onChange={(value) => setFormData(prev => ({ ...prev, offerDate: value }))}
                                            required
                                            min={new Date().toISOString().slice(0, 16)}
                                        />
                                        <div>
                                            <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700 mb-2">
                                                Available Seats
                                            </label>
                                            <select
                                                id="availableSeats"
                                                name="availableSeats"
                                                value={formData.availableSeats}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                            >
                                                <option value={1}>1 seat</option>
                                                <option value={2}>2 seats</option>
                                                <option value={3}>3 seats</option>
                                                <option value={4}>4 seats</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="border-t border-gray-200 pt-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                                            isSubmitting
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-[1.02]'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating Ride Offer...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Offer Ride
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OfferRide;