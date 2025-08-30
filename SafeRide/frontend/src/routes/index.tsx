import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Rides from '../pages/Rides';
import OfferRide from '../pages/OfferRide';
import Verification from '../pages/Verification';
import SchoolEnrollment from '../pages/SchoolEnrollment';
import AdminPanel from '../pages/AdminPanel';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import NavBar from '../components/layout/NavBar';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { useMicrosoftAuth } from '../contexts/MicrosoftAuthContext';

const AppRoutes = () => {
    const { isAuthenticated: isTraditionalAuth } = useAuth();
    const { isAuthenticated: isMicrosoftAuth } = useMicrosoftAuth();
    
    // Show navbar if user is authenticated via either method
    const isAuthenticated = isTraditionalAuth || isMicrosoftAuth;
    const basename = ''; // Use root path for Azure Static Web Apps

    // Component to handle root route redirection
    const RootRedirect = () => {
        if (isAuthenticated) {
            return <Navigate to="/dashboard" replace />;
        }
        return <Landing />;
    };

    return (
        <Router basename={basename}>
            {isAuthenticated && <NavBar />}
            <main className={isAuthenticated ? "container mx-auto px-4 py-8" : ""}>
                <Routes>
                    <Route path="/" element={<RootRedirect />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/rides" element={<ProtectedRoute><Rides /></ProtectedRoute>} />
                    <Route path="/offer-ride" element={<ProtectedRoute><OfferRide /></ProtectedRoute>} />
                    <Route path="/school-enrollment" element={<ProtectedRoute><SchoolEnrollment /></ProtectedRoute>} />
                    <Route path="/verification" element={<ProtectedRoute><Verification /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="/admin" element={<AdminPanel />} />
                </Routes>
            </main>
        </Router>
    );
};

export default AppRoutes;