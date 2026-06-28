import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import GuestPage from './pages/GuestPage';
import OwnerLayout from './layouts/OwnerLayout';
import PublicLayout from './layouts/PublicLayout';

export default function App() {



  return (
    <BrowserRouter>
      <Routes>
        {/* Owner Authentication */}
        <Route path="/login" element={<LoginPage />} />

        {/* Public Guest Property View */}
        <Route element={<PublicLayout />}>
          <Route path="/property/sunrise-homestay-coorg" element={<GuestPage />} />
          <Route path="/property/sunrise-homestay" element={<GuestPage />} />
        </Route>


        {/* Protected Owner Dashboard */}
        <Route element={<OwnerLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Default Redirection */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

