import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';


  

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  console.log('ProtectedRoute - User:', user);
  console.log('ProtectedRoute - AllowedRoles:', allowedRoles);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.warn('User role not allowed, redirecting to home');
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
