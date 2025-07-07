import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './routes/landingpage.tsx';
import Customer from './routes/customer.tsx';
import ManagerLogin from './routes/ManagerLogin.tsx';
import Manager from './routes/manager.tsx';
import SchedulePage from './routes/SchedulePage.tsx';
import InventoryPage from './routes/InventoryPage.tsx'; 
import CustomerPage from './routes/CustomerPage';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Future routes for manager and customer can go here */}
        <Route path="/customer" element={<Customer />} />
        <Route path="/manager" element={<ManagerLogin />} /> 
        <Route path="/manager/dashboard" element={<Manager />} />
        <Route path="/manager/schedule" element={<SchedulePage />} />
        <Route path="/manager/inventory" element={<InventoryPage />} />
        <Route path="/customer/inventory" element={<CustomerPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
