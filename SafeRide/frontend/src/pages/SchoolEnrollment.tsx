import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { config } from '../config/environment';

interface School {
    id: number;
    name: string;
    address: string;
    isActive: boolean;
    contactEmail?: string;
    contactPhone?: string;
}

interface Enrollment {
    id: string;
    schoolId: number;
    schoolName: string;
    status: string;
    requestDate: string;
    approvalDate?: string;
    rejectionReason?: string;
    parentNotes?: string;
}

const SchoolEnrollment: React.FC = () => {
    const { user } = useAuth();
    const [schools, setSchools] = useState<School[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [approvedSchools, setApprovedSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [enrollmentNotes, setEnrollmentNotes] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch available schools
            const schoolsResponse = await fetch(`${config.apiBaseUrl}/schools`);
            if (schoolsResponse.ok) {
                const schoolsData = await schoolsResponse.json();
                setSchools(schoolsData);
            }

            // Fetch user's enrollments
            const enrollmentsResponse = await fetch(`${config.apiBaseUrl}/schools/my-enrollments`);
            if (enrollmentsResponse.ok) {
                const enrollmentsData = await enrollmentsResponse.json();
                setEnrollments(enrollmentsData);
            }

            // Fetch approved schools
            const approvedResponse = await fetch(`${config.apiBaseUrl}/schools/approved-schools`);
            if (approvedResponse.ok) {
                const approvedData = await approvedResponse.json();
                setApprovedSchools(approvedData);
            }
        } catch (err) {
            setError('Failed to load school data');
        } finally {
            setLoading(false);
        }
    };

    const handleEnrollment = async (schoolId: number) => {
        try {
            setEnrolling(schoolId);
            setError(null);

            const response = await fetch(`${config.apiBaseUrl}/schools/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    schoolId,
                    parentNotes: enrollmentNotes[schoolId] || ''
                }),
            });

            if (response.ok) {
                await fetchData(); // Refresh data
                setEnrollmentNotes(prev => ({ ...prev, [schoolId]: '' }));
                alert('Enrollment request submitted successfully!');
            } else {
                const errorData = await response.json();
                setError(errorData.errors?.[0] || errorData.message || 'Failed to submit enrollment request');
            }
        } catch (err: any) {
            setError('Failed to submit enrollment request');
        } finally {
            setEnrolling(null);
        }
    };

    const getEnrollmentStatus = (schoolId: number) => {
        return enrollments.find(e => e.schoolId === schoolId);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'rejected': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-lg text-gray-600">Loading schools...</div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">School Enrollment</h1>
                <p className="text-gray-600">
                    Enroll in participating schools to access SafeRide services. 
                    Your enrollment must be approved by school administrators.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                    <div className="text-sm text-red-600">{error}</div>
                </div>
            )}

            {/* Approved Schools Section */}
            {approvedSchools.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Your Approved Schools</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {approvedSchools.map((school) => (
                            <div key={school.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">{school.name}</h3>
                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                        ✓ Approved
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">{school.address}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Available Schools Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Available Schools</h2>
                <div className="space-y-4">
                    {schools.map((school) => {
                        const enrollment = getEnrollmentStatus(school.id);
                        const isApproved = approvedSchools.some(s => s.id === school.id);
                        
                        return (
                            <div key={school.id} className="bg-white border rounded-lg p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex-1 mb-4 lg:mb-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                                            {enrollment && (
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(enrollment.status)}`}>
                                                    {enrollment.status}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 mb-2">{school.address}</p>
                                        {school.contactEmail && (
                                            <p className="text-sm text-gray-500">Contact: {school.contactEmail}</p>
                                        )}
                                        
                                        {enrollment?.rejectionReason && (
                                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                                                <p className="text-sm text-red-600">
                                                    <strong>Rejection reason:</strong> {enrollment.rejectionReason}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="lg:ml-6">
                                        {!enrollment && !isApproved && (
                                            <div className="space-y-3">
                                                <textarea
                                                    placeholder="Optional: Add a note about why you want to enroll (e.g., child attends this school)"
                                                    value={enrollmentNotes[school.id] || ''}
                                                    onChange={(e) => setEnrollmentNotes(prev => ({
                                                        ...prev,
                                                        [school.id]: e.target.value
                                                    }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                    rows={2}
                                                />
                                                <button
                                                    onClick={() => handleEnrollment(school.id)}
                                                    disabled={enrolling === school.id}
                                                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {enrolling === school.id ? 'Enrolling...' : 'Request Enrollment'}
                                                </button>
                                            </div>
                                        )}
                                        
                                        {enrollment && enrollment.status === 'Pending' && (
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600 mb-2">Enrollment pending approval</p>
                                                <p className="text-xs text-gray-500">
                                                    Requested: {new Date(enrollment.requestDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                        
                                        {enrollment && enrollment.status === 'Rejected' && (
                                            <button
                                                onClick={() => handleEnrollment(school.id)}
                                                disabled={enrolling === school.id}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                            >
                                                {enrolling === school.id ? 'Re-enrolling...' : 'Request Again'}
                                            </button>
                                        )}
                                        
                                        {isApproved && (
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-green-600">✓ Enrolled & Approved</p>
                                                <p className="text-xs text-gray-500">You can offer/book rides for this school</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Enrollment Status Section */}
            {enrollments.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Your Enrollment History</h2>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        School
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Request Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Approval Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {enrollments.map((enrollment) => (
                                    <tr key={enrollment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {enrollment.schoolName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(enrollment.status)}`}>
                                                {enrollment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(enrollment.requestDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {enrollment.approvalDate ? 
                                                new Date(enrollment.approvalDate).toLocaleDateString() : 
                                                '-'
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchoolEnrollment;
