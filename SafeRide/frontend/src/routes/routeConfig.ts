import { lazy } from 'react';

const Landing = lazy(() => import('../pages/Landing'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Rides = lazy(() => import('../pages/Rides'));
const OfferRide = lazy(() => import('../pages/OfferRide'));
const Verification = lazy(() => import('../pages/Verification'));
const NotFound = lazy(() => import('../pages/NotFound'));

const routes = [
    {
        path: '/',
        element: <Landing />,
        exact: true,
    },
    {
        path: '/dashboard',
        element: <Dashboard />,
        exact: true,
    },
    {
        path: '/rides',
        element: <Rides />,
        exact: true,
    },
    {
        path: '/offer-ride',
        element: <OfferRide />,
        exact: true,
    },
    {
        path: '/verification',
        element: <Verification />,
        exact: true,
    },
    {
        path: '*',
        element: <NotFound />,
    },
];

export default routes;