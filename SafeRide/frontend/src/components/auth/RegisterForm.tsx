import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../store/slices/authSlice';
import Button from '../common/Button';

const RegisterForm: React.FC = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        drivingLicense: '',
        workingWithChildrenCard: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await dispatch(registerUser(formData)).unwrap();
            // Handle successful registration (e.g., redirect to dashboard)
        } catch (err) {
            setError('Registration failed. Please check your details and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold">Register</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input"
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input"
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input"
            />
            <input
                type="text"
                name="drivingLicense"
                placeholder="Driving License Number"
                value={formData.drivingLicense}
                onChange={handleChange}
                required
                className="input"
            />
            <input
                type="text"
                name="workingWithChildrenCard"
                placeholder="Working With Children Card Number"
                value={formData.workingWithChildrenCard}
                onChange={handleChange}
                required
                className="input"
            />
            <Button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
            </Button>
        </form>
    );
};

export default RegisterForm;