import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ReworkStationPage from '../features/station/ReworkStationPage';
import SortingStationPage from '../features/station/SortingStationPage';
import ProductionStationPage from '../features/production/ProductionStationPage';
import MachineSelectionPage from '../features/station/MachineSelectionPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MachineSelectionPage />,
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
    element: <Navigate to="/" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
