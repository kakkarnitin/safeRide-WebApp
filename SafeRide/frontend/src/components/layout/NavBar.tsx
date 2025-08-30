import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMicrosoftAuth } from '../../contexts/MicrosoftAuthContext';

const NavBar: React.FC = () => {
    const { user, logout } = useAuth();
    const { user: microsoftUser, logout: microsoftLogout, isAuthenticated: isMicrosoftAuth } = useMicrosoftAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get the current user (either from traditional auth or Microsoft auth)
    const currentUser = microsoftUser || user;
    const isAuthenticated = isMicrosoftAuth || !!user;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        setIsDropdownOpen(false);
        if (isMicrosoftAuth) {
            await microsoftLogout();
        } else {
            logout();
        }
        navigate('/');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Get user initials for avatar
    const getUserInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const activeLinkStyle = "relative text-white bg-white/15 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 shadow-sm after:content-[''] after:absolute after:bottom-[-17px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-8 after:h-0.5 after:bg-white after:rounded-full";
    const inactiveLinkStyle = "text-white/80 hover:text-white hover:bg-white/10 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 no-underline hover:no-underline";

    return (
        <nav className="sticky top-0 z-50 bg-blue-600 border-b border-blue-700 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo with Icon */}
                    <Link to="/dashboard" className="flex items-center space-x-3 text-white hover:text-indigo-200 transition-colors group flex-shrink-0">
                        {/* SafeRide Icon */}
                        <div className="relative">
                            <svg className="w-8 h-8 text-white group-hover:text-indigo-200 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                {/* Car body */}
                                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L4 8v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h10v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1V8l-1.08-1.99zM6.5 12c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9s1.5.67 1.5 1.5S7.33 12 6.5 12zm11 0c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 7h14l-.78 1.5H5.78L5 7z"/>
                            </svg>
                            {/* Safety shield overlay */}
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-wider leading-tight">SafeRide</span>
                            <span className="text-xs text-blue-200 font-medium leading-tight">School Carpools</span>
                        </div>
                    </Link>
                    
                    {/* Main Navigation - Centered with better spacing */}
                    <div className="hidden md:flex flex-1 justify-center">
                        <div className="flex items-center space-x-8 lg:space-x-12">
                            <NavLink 
                                to="/dashboard" 
                                className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
                            >
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                                    </svg>
                                    <span>Dashboard</span>
                                </div>
                            </NavLink>
                            <NavLink 
                                to="/rides" 
                                className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
                            >
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <span>Find a Ride</span>
                                </div>
                            </NavLink>
                            <NavLink 
                                to="/offer-ride" 
                                className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
                            >
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span>Offer a Ride</span>
                                </div>
                            </NavLink>
                            <NavLink 
                                to="/school-enrollment" 
                                className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
                            >
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span>Schools</span>
                                </div>
                            </NavLink>
                            <NavLink 
                                to="/verification" 
                                className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
                            >
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Verification</span>
                                </div>
                            </NavLink>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="text-white hover:text-indigo-200 transition-colors p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* User Profile Dropdown - Right Corner */}
                    {isAuthenticated && currentUser && (
                        <div className="relative flex-shrink-0" ref={dropdownRef}>
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center space-x-2 text-white hover:bg-white/10 rounded-md px-2 py-1.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/25 focus:ring-offset-2 focus:ring-offset-blue-600"
                            >
                                {/* User Avatar */}
                                <div className="w-7 h-7 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                    {getUserInitials(currentUser.name || 'User')}
                                </div>
                                {/* Dropdown Arrow */}
                                <svg 
                                    className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu - GitHub Style */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-3 w-72 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50 ring-1 ring-black ring-opacity-5">
                                    {/* User Info Section */}
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                                                {getUserInitials(currentUser.name || 'User')}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {currentUser.name || 'User'}
                                                </p>
                                                <p className="text-sm text-gray-600 truncate">
                                                    {currentUser.email || 'No email'}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {isMicrosoftAuth ? '🔗 Microsoft Account' : '🏠 Local Account'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-1">
                                        <Link
                                            to="/profile"
                                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="font-medium">Your profile</span>
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="font-medium">Settings</span>
                                        </Link>
                                        
                                        {/* Divider */}
                                        <div className="border-t border-gray-100 my-1"></div>
                                        
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors group"
                                        >
                                            <svg className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span className="font-medium">Sign out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Mobile Navigation Menu */}
            {isDropdownOpen && (
                <div className="md:hidden bg-blue-700 border-t border-blue-600">
                    <div className="px-4 py-3 space-y-1">
                        <NavLink 
                            to="/dashboard" 
                            className="flex items-center space-x-3 text-white hover:bg-blue-600 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                            </svg>
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink 
                            to="/rides" 
                            className="flex items-center space-x-3 text-white hover:bg-blue-600 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span>Find a Ride</span>
                        </NavLink>
                        <NavLink 
                            to="/offer-ride" 
                            className="flex items-center space-x-3 text-white hover:bg-blue-600 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Offer a Ride</span>
                        </NavLink>
                        <NavLink 
                            to="/school-enrollment" 
                            className="flex items-center space-x-3 text-white hover:bg-blue-600 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span>Schools</span>
                        </NavLink>
                        <NavLink 
                            to="/verification" 
                            className="flex items-center space-x-3 text-white hover:bg-blue-600 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Verification</span>
                        </NavLink>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavBar;