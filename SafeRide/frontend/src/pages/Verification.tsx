import React, { useState } from 'react';

const Verification: React.FC = () => {
    const [status, setStatus] = useState<'Not Verified' | 'Verifying...' | 'Verified'>('Not Verified');
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }
        setStatus('Verifying...');
        
        // Mock verification process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setStatus('Verified');
        alert('Your document has been submitted and you are now verified!');
    };

    const getStatusClasses = () => {
        switch (status) {
            case 'Verified':
                return 'bg-green-100 text-green-800';
            case 'Verifying...':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Account Verification
            </h2>
            
            <div className={`p-4 rounded-lg mb-6 text-center font-semibold ${getStatusClasses()}`}>
                Status: {status}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Driver's License
                    </label>
                    <input 
                        id="license"
                        type="file" 
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        accept="image/png, image/jpeg, application/pdf"
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'Verifying...' || status === 'Verified'}
                    className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
                        (status === 'Verifying...' || status === 'Verified')
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                >
                    {status === 'Verified' ? 'Verified' : status === 'Verifying...' ? 'Submitting...' : 'Submit for Verification'}
                </button>
            </form>
        </div>
    );
};

export default Verification;