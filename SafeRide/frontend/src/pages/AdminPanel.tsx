import React, { useState, useEffect } from 'react';

interface School {
  id: number;
  name: string;
  address: string;
  isActive: boolean;
  contactEmail?: string;
  contactPhone?: string;
}

interface PendingEnrollment {
  id: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  schoolId: string;
  schoolName: string;
  status: string;
  requestDate: string;
  parentNotes?: string;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schools' | 'enrollments'>('schools');
  const [schools, setSchools] = useState<School[]>([]);
  const [pendingEnrollments, setPendingEnrollments] = useState<PendingEnrollment[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [newSchool, setNewSchool] = useState({
    name: '',
    address: '',
    contactEmail: '',
    contactPhone: ''
  });

  useEffect(() => {
    if (activeTab === 'schools') {
      loadSchools();
    } else if (activeTab === 'enrollments') {
      loadPendingEnrollments();
    }
  }, [activeTab]);

  const loadSchools = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/schools');
      if (response.ok) {
        const data = await response.json();
        setSchools(data);
      }
    } catch (error) {
      console.error('Failed to load schools:', error);
    }
  };

  const loadPendingEnrollments = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/schools/pending-enrollments');
      if (response.ok) {
        const data = await response.json();
        setPendingEnrollments(data);
      }
    } catch (error) {
      console.error('Failed to load pending enrollments:', error);
      setMessage({ type: 'error', text: 'Failed to load pending enrollments' });
    }
  };

  const addSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSchool),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'School added successfully!' });
        setNewSchool({ name: '', address: '', contactEmail: '', contactPhone: '' });
        setShowAddForm(false);
        loadSchools();
      } else {
        setMessage({ type: 'error', text: 'Failed to add school' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add school' });
    } finally {
      setLoading(false);
    }
  };

  const addSampleSchools = async () => {
    setLoading(true);
    const sampleSchools = [
      {
        name: 'Melbourne Grammar School',
        address: '355 St Kilda Rd, Melbourne VIC 3000',
        contactEmail: 'admin@mgs.vic.edu.au',
        contactPhone: '(03) 9865 7777'
      },
      {
        name: 'Wesley College',
        address: '577 St Kilda Rd, Melbourne VIC 3004',
        contactEmail: 'info@wesleycollege.edu.au',
        contactPhone: '(03) 8102 6000'
      },
      {
        name: 'Scotch College',
        address: '76 Shenton Rd, Swanbourne WA 6010',
        contactEmail: 'info@scotch.wa.edu.au',
        contactPhone: '(08) 9383 6800'
      },
      {
        name: 'Sydney Grammar School',
        address: 'College St, Darlinghurst NSW 2010',
        contactEmail: 'info@sgs.nsw.edu.au',
        contactPhone: '(02) 9332 9700'
      }
    ];

    for (const school of sampleSchools) {
      try {
        await fetch('http://localhost:5001/api/schools', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(school),
        });
      } catch (error) {
        console.error('Failed to add school:', school.name, error);
      }
    }

    setMessage({ type: 'success', text: 'Sample schools added successfully!' });
    loadSchools();
    setLoading(false);
  };

  const handleEnrollmentApproval = async (enrollmentId: string, approve: boolean, adminNotes?: string, rejectionReason?: string) => {
    try {
      const response = await fetch('http://localhost:5001/api/schools/approve-enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enrollmentId,
          approve,
          adminNotes,
          rejectionReason
        }),
      });

      if (response.ok) {
        const action = approve ? 'approved' : 'rejected';
        setMessage({ type: 'success', text: `Enrollment ${action} successfully!` });
        loadPendingEnrollments(); // Refresh the list
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || 'Failed to process enrollment' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to process enrollment' });
    }
  };

  const approveEnrollment = (enrollmentId: string) => {
    const adminNotes = prompt('Enter admin notes (optional):');
    handleEnrollmentApproval(enrollmentId, true, adminNotes || undefined);
  };

  const rejectEnrollment = (enrollmentId: string) => {
    const rejectionReason = prompt('Enter rejection reason (required):');
    if (!rejectionReason) {
      setMessage({ type: 'error', text: 'Rejection reason is required' });
      return;
    }
    const adminNotes = prompt('Enter admin notes (optional):');
    handleEnrollmentApproval(enrollmentId, false, adminNotes || undefined, rejectionReason);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>
        
        {message && (
          <div className={`mb-4 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('schools')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'schools'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              School Management
            </button>
            <button
              onClick={() => setActiveTab('enrollments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'enrollments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Enrollment Approvals
              {pendingEnrollments.length > 0 && (
                <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {pendingEnrollments.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Schools Tab */}
        {activeTab === 'schools' && (
          <>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {showAddForm ? 'Cancel' : 'Add New School'}
              </button>
              
              <button
                onClick={addSampleSchools}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Sample Schools'}
              </button>
              
              <button
                onClick={loadSchools}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Refresh Schools
              </button>
            </div>

            {showAddForm && (
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">Add New School</h2>
                <form onSubmit={addSchool} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      School Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSchool.name}
                      onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSchool.address}
                      onChange={(e) => setNewSchool({ ...newSchool, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={newSchool.contactEmail}
                      onChange={(e) => setNewSchool({ ...newSchool, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={newSchool.contactPhone}
                      onChange={(e) => setNewSchool({ ...newSchool, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Adding...' : 'Add School'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold mb-4">Schools ({schools.length})</h2>
              
              {schools.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No schools found. Add some schools to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {schools.map((school) => (
                        <tr key={school.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {school.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {school.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {school.address}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {school.contactEmail && (
                              <div>{school.contactEmail}</div>
                            )}
                            {school.contactPhone && (
                              <div>{school.contactPhone}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              school.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {school.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Enrollments Tab */}
        {activeTab === 'enrollments' && (
          <>
            <div className="flex gap-4 mb-6">
              <button
                onClick={loadPendingEnrollments}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Refresh Enrollments
              </button>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">
                Pending Enrollments ({pendingEnrollments.length})
              </h2>
              
              {pendingEnrollments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No pending enrollments found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Enrollment Request
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">Parent:</span> {enrollment.parentName}</p>
                            <p><span className="font-medium">Email:</span> {enrollment.parentEmail}</p>
                            <p><span className="font-medium">School:</span> {enrollment.schoolName}</p>
                            <p><span className="font-medium">Request Date:</span> {new Date(enrollment.requestDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Parent Notes</h4>
                          <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                            {enrollment.parentNotes || 'No notes provided'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => approveEnrollment(enrollment.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectEnrollment(enrollment.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
