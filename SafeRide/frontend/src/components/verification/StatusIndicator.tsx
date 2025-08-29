import React from 'react';

interface StatusIndicatorProps {
    isVerified: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isVerified }) => {
    return (
        <div className={`status-indicator ${isVerified ? 'verified' : 'not-verified'}`}>
            {isVerified ? (
                <span className="text-green-500">Verified</span>
            ) : (
                <span className="text-red-500">Not Verified</span>
            )}
        </div>
    );
};

export default StatusIndicator;