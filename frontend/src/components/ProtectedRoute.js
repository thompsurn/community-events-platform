import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';


  

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  console.log('ProtectedRoute - User:', user);
  console.log('ProtectedRoute - AllowedRoles:', allowedRoles);

  if (!user) {
    // Redirect to the login page if the user is not authenticated
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to the home page if the user does not have the required role
    console.warn('User role not allowed, redirecting to home');
    return <Navigate to="/" />;
  }

  // Render the children if the user is authenticated and authorized
  return children;
}

export default ProtectedRoute;
