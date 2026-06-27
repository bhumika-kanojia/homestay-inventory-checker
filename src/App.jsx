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
        {/* Public Guest Property View */}
        <Route element={<PublicLayout />}>
          <Route path="/property/sunrise-homestay-coorg" element={<GuestPage />} />
          <Route path="/property/sunrise-homestay" element={<GuestPage />} />
        </Route>

        {/* Owner Authentication */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Owner Dashboard */}
        <Route element={<OwnerLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Default Redirection */}
        <Route path="/" element={<Navigate to="/property/sunrise-homestay" replace />} />
        <Route path="*" element={<Navigate to="/property/sunrise-homestay" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

