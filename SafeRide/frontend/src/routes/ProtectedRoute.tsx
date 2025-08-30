import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMicrosoftAuth } from '../contexts/MicrosoftAuthContext';

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated: isTraditionalAuth, isLoading: isTraditionalLoading, user: traditionalUser } = useAuth();
    const { isAuthenticated: isMicrosoftAuth, isLoading: isMicrosoftLoading, user: microsoftUser } = useMicrosoftAuth();

    // Check if either auth method has a user
    const hasUser = (isMicrosoftAuth && microsoftUser) || (isTraditionalAuth && traditionalUser);
    const isStillLoading = (isMicrosoftLoading || isTraditionalLoading) && !hasUser;

    // If we have a user from either auth method, show the protected content
    if (hasUser) {
        return <>{children}</>;
    }

    // If still loading authentication, show loading state
    if (isStillLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading authentication...</div>
            </div>
        );
    }

    // No user and not loading, redirect to login
    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;