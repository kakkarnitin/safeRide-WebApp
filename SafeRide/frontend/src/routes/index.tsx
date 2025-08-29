import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Rides from '../pages/Rides';
import OfferRide from '../pages/OfferRide';
import Verification from '../pages/Verification';
import SchoolEnrollment from '../pages/SchoolEnrollment';
import AdminPanel from '../pages/AdminPanel';
import NavBar from '../components/layout/NavBar';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            {isAuthenticated && <NavBar />}
            <main className={isAuthenticated ? "container mx-auto px-4 py-8" : ""}>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/rides" element={<ProtectedRoute><Rides /></ProtectedRoute>} />
                    <Route path="/offer-ride" element={<ProtectedRoute><OfferRide /></ProtectedRoute>} />
                    <Route path="/school-enrollment" element={<ProtectedRoute><SchoolEnrollment /></ProtectedRoute>} />
                    <Route path="/verification" element={<ProtectedRoute><Verification /></ProtectedRoute>} />
                    <Route path="/admin" element={<AdminPanel />} />
                </Routes>
            </main>
        </Router>
    );
};

export default AppRoutes;