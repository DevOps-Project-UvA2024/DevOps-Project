// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, AuthStatus } from './AuthProvider';

const ProtectedRoute = () => {
  const { authStatus } = useAuth();

  if (authStatus === AuthStatus.Loading) {
    return <div>Loading...</div>; // Optionally, render a loading indicator
  }

  return authStatus === AuthStatus.SignedIn ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
