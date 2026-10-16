import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ReworkStationPage from '../features/station/ReworkStationPage';
import SortingStationPage from '../features/station/SortingStationPage';
import ProductionStationPage from '../features/production/ProductionStationPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/rework" replace />,
  },
  {
    path: '/rework',
    element: <ReworkStationPage />,
  },
  {
    path: '/sorting',
    element: <SortingStationPage />,
  },
  {
    path: '/production',
    element: <ProductionStationPage />,
  },
  {
    path: '/app',
    element: <Navigate to="/rework" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/rework" replace />,
  },
]);
