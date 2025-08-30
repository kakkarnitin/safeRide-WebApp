import React, { useEffect } from 'react';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { MicrosoftAuthProvider, msalInstance } from './contexts/MicrosoftAuthContext';
import './index.css';

const App: React.FC = () => {
  useEffect(() => {
    // Handle MSAL redirect on app startup
    msalInstance.handleRedirectPromise()
      .then((response) => {
        if (response) {
          console.log('Redirect authentication successful:', response);
        }
      })
      .catch((error) => {
        console.error('Error handling redirect:', error);
      });
  }, []);

  return (
    <MicrosoftAuthProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </MicrosoftAuthProvider>
  );
};

export default App;