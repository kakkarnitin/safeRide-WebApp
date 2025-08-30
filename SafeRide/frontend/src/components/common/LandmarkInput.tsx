import React from 'react';

interface LandmarkInputProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (landmark: string) => void;
    className?: string;
}

const LandmarkInput: React.FC<LandmarkInputProps> = ({
    label,
    placeholder,
    value,
    onChange,
    className = ""
}) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={className}>
            <label htmlFor={`landmark-${label}`} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <input
                id={`landmark-${label}`}
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
                Optional: Add a landmark or reference point for easier identification
            </p>
        </div>
    );
};

export default LandmarkInput;
