import React, { useState, useRef, useEffect } from 'react';

interface DateTimePickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    min?: string;
    className?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
    label,
    value,
    onChange,
    required = false,
    min,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setTempValue(value); // Reset to original value if clicking outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [value]);

    // Format the display value
    const formatDisplayValue = (val: string) => {
        if (!val) return 'Select date and time';
        const date = new Date(val);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleInputClick = () => {
        setIsOpen(!isOpen);
        setTempValue(value);
    };

    const handleDateTimeChange = (newValue: string) => {
        setTempValue(newValue);
    };

    const handleOkClick = () => {
        onChange(tempValue);
        setIsOpen(false);
    };

    const handleCancelClick = () => {
        setTempValue(value);
        setIsOpen(false);
    };

    const handleClearClick = () => {
        setTempValue('');
        onChange('');
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {/* Custom Input Display */}
            <div
                onClick={handleInputClick}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white cursor-pointer hover:border-gray-400 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-colors"
            >
                <div className="flex items-center justify-between">
                    <span className={value ? 'text-gray-900' : 'text-gray-500'}>
                        {formatDisplayValue(value)}
                    </span>
                    <svg 
                        className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Dropdown Calendar */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl">
                    <div className="p-4 space-y-4">
                        <input
                            ref={inputRef}
                            type="datetime-local"
                            value={tempValue}
                            onChange={(e) => handleDateTimeChange(e.target.value)}
                            min={min}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        />
                        
                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleClearClick}
                                className="text-sm text-gray-600 hover:text-gray-800 transition-colors font-medium"
                            >
                                Clear
                            </button>
                            
                            <div className="flex space-x-2">
                                <button
                                    type="button"
                                    onClick={handleCancelClick}
                                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleOkClick}
                                    disabled={!tempValue}
                                    className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md transition-colors"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateTimePicker;
