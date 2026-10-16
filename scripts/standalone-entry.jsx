import React from 'react';
import {createRoot} from 'react-dom/client';
import {RouterProvider} from 'react-router-dom';
import {router} from '../src/app/router.jsx';
import '../src/shared/styles/global.css';
import '../src/shared/styles/mes-station.css';
createRoot(document.getElementById('root')).render(React.createElement(RouterProvider,{router}));
