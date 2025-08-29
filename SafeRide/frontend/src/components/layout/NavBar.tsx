import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NavBar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const activeLinkStyle = {
        textDecoration: 'underline',
        color: '#E0E7FF',
    };

    return (
        <nav className="bg-blue-600 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="text-white text-2xl font-bold tracking-wider">
                    SafeRide
                </Link>
                <div className="flex items-center space-x-6">
                    <NavLink 
                        to="/dashboard" 
                        className="text-white hover:text-indigo-200 transition-colors"
                        style={({ isActive }) => isActive ? activeLinkStyle : {}}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink 
                        to="/rides" 
                        className="text-white hover:text-indigo-200 transition-colors"
                        style={({ isActive }) => isActive ? activeLinkStyle : {}}
                    >
                        Find a Ride
                    </NavLink>
                    <NavLink 
                        to="/offer-ride" 
                        className="text-white hover:text-indigo-200 transition-colors"
                        style={({ isActive }) => isActive ? activeLinkStyle : {}}
                    >
                        Offer a Ride
                    </NavLink>
                    <NavLink 
                        to="/school-enrollment" 
                        className="text-white hover:text-indigo-200 transition-colors"
                        style={({ isActive }) => isActive ? activeLinkStyle : {}}
                    >
                        Schools
                    </NavLink>
                    <NavLink 
                        to="/verification" 
                        className="text-white hover:text-indigo-200 transition-colors"
                        style={({ isActive }) => isActive ? activeLinkStyle : {}}
                    >
                        Verification
                    </NavLink>
                    <div className="flex items-center space-x-4 ml-4">
                        <span className="text-white text-sm">
                            Welcome, {user?.name || 'User'}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;