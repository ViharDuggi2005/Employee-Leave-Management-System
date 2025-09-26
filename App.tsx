
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import LoginPage from './pages/LoginPage';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './types';
import Layout from './components/Layout';

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/employee/dashboard" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.EMPLOYEE]}>
                <Layout>
                  <EmployeeDashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
