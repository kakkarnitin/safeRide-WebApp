import React, { useState, useEffect, useRef } from 'react';

interface LocationSearchProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (location: string) => void;
    required?: boolean;
    className?: string;
}

interface LocationSuggestion {
    place_id: string;
    display_name: string;
    lat: string;
    lon: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
    label,
    placeholder,
    value,
    onChange,
    required = false,
    className = ""
}) => {
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const searchLocations = async (query: string) => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            // Using Nominatim (OpenStreetMap) API - free alternative to Google Places
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=au&q=${encodeURIComponent(query)}`
            );
            const data = await response.json();
            
            const formattedSuggestions = data.map((item: any) => ({
                place_id: item.place_id,
                display_name: item.display_name,
                lat: item.lat,
                lon: item.lon
            }));
            
            setSuggestions(formattedSuggestions);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error searching locations:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);

        // Debounce the search
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        
        debounceRef.current = setTimeout(() => {
            searchLocations(newValue);
        }, 300);
    };

    const handleSuggestionClick = (suggestion: LocationSuggestion) => {
        setInputValue(suggestion.display_name);
        onChange(suggestion.display_name);
        setShowSuggestions(false);
        setSuggestions([]);
    };

    const handleBlur = () => {
        // Delay hiding suggestions to allow clicking
        setTimeout(() => setShowSuggestions(false), 200);
    };

    return (
        <div className={`relative ${className}`}>
            <label htmlFor={`location-${label}`} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="relative">
                <input
                    id={`location-${label}`}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder={placeholder}
                    required={required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                
                {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                    </div>
                )}
                
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion.place_id}
                                type="button"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                            >
                                <div className="text-sm text-gray-900">{suggestion.display_name}</div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
                Start typing to search for addresses in Australia
            </p>
        </div>
    );
};

export default LocationSearch;
