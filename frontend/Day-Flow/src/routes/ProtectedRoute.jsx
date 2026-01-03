import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles) {
    const userRole = user.role?.toLowerCase();
    const hasPermission = allowedRoles.some(role => role.toLowerCase() === userRole);

    if (!hasPermission) {
      // Redirect based on role if accessing unauthorized area
      const targetDashboard = userRole === 'admin' || userRole === 'hr' ? '/admin-dashboard' : '/employee-dashboard';
      return <Navigate to={targetDashboard} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
