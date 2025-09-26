
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to login or a 'not authorized' page
    // For simplicity, redirecting to login.
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
