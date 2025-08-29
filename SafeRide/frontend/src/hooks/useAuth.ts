import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../store/slices/authSlice';
import { RootState } from '../store';

const useAuth = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            // Logic to check if user is authenticated
            // This could involve checking a token in local storage or making an API call
            const token = localStorage.getItem('token');
            if (token) {
                // Dispatch an action to set the user state
                dispatch(login(token));
            } else {
                dispatch(logout());
            }
            setLoading(false);
        };

        checkAuthStatus();
    }, [dispatch]);

    const handleLogin = async (credentials: { email: string; password: string }) => {
        // Logic to handle user login
        // This could involve making an API call to authenticate the user
        const token = await someAuthApi.login(credentials);
        localStorage.setItem('token', token);
        dispatch(login(token));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(logout());
    };

    return {
        user,
        isAuthenticated,
        loading,
        handleLogin,
        handleLogout,
    };
};

export default useAuth;