// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, AuthStatus } from './AuthProvider';
import useFetchUserInfo from './userInfoFetch';

const ProtectedRoute = () => {
  const { authStatus } = useAuth();
  useFetchUserInfo();

  // While there are no user info, show a loading text
  if (authStatus === AuthStatus.Loading) {
    return <div>Loading...</div>; // Optionally, render a loading indicator
  }

  // If the user is signed in, render the requested component, if not, redirect to sign in
  return authStatus === AuthStatus.SignedIn ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
