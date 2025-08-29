import React from 'react';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;