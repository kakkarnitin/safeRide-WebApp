import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const DashboardLayout: React.FC = () => {
    return (
        <div className="flex flex-col h-screen">
            <NavBar />
            <main className="flex-grow p-4">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;