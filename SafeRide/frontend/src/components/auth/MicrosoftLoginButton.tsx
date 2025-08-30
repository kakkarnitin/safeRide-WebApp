import React from 'react';
import { useMicrosoftAuth } from '../../contexts/MicrosoftAuthContext';

interface MicrosoftLoginButtonProps {
  onClick?: () => Promise<void>;
  disabled?: boolean;
}

const MicrosoftLoginButton: React.FC<MicrosoftLoginButtonProps> = ({ 
  onClick, 
  disabled: externalDisabled 
}) => {
  const { login, isLoading } = useMicrosoftAuth();
  
  const handleClick = async () => {
    try {
      if (onClick) {
        await onClick();
      } else {
        await login();
        // Let the Login component handle the redirect via useEffect
      }
    } catch (error) {
      console.error('MicrosoftLoginButton: Login failed:', error);
    }
  };
  
  const isDisabled = externalDisabled || isLoading;

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <svg
        className="w-5 h-5 mr-3"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.5 0H0V10.5H10.5V0Z"
          fill="#F25022"
        />
        <path
          d="M21 0H10.5V10.5H21V0Z"
          fill="#7FBA00"
        />
        <path
          d="M10.5 10.5H0V21H10.5V10.5Z"
          fill="#00A4EF"
        />
        <path
          d="M21 10.5H10.5V21H21V10.5Z"
          fill="#FFB900"
        />
      </svg>
      {isDisabled ? 'Signing in...' : 'Continue with Microsoft'}
    </button>
  );
};

export default MicrosoftLoginButton;
