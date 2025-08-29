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
            <label htmlFor={`landmark-${label}`} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                id={`landmark-${label}`}
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
                Optional: Add a landmark or specific instructions (e.g., "Near the big oak tree", "School main entrance")
            </p>
        </div>
    );
};

export default LandmarkInput;
