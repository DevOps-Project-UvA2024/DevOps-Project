import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { AmIAuthenticated } from "./AmIAuthenticated";
import PropTypes from 'prop-types'; 

// Authentication status indicators
const AuthStatus = {
  Loading: 'Loading',
  SignedIn: 'SignedIn',
  SignedOut: 'SignedOut',
};

const AuthContext = createContext({
  authStatus: AuthStatus.Loading, // Initial loading state
  signIn: () => {}, // Placeholder for signIn function
  signOut: () => {}, // Placeholder for signOut function
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(AuthStatus.Loading);

  // Check authentication status on component mount
  useEffect(() => {
    AmIAuthenticated()
      .then(isAuthenticated => setAuthStatus(isAuthenticated ? AuthStatus.SignedIn : AuthStatus.SignedOut))
      .catch(() => setAuthStatus(AuthStatus.SignedOut));
  }, []);

  // Sign-in logic
  function signIn() {
    setAuthStatus(AuthStatus.SignedIn);
  }

  // Sign-out logic
  function signOut() {
    setAuthStatus(AuthStatus.SignedOut);
  }

  // Memoize context value to avoid unnecessary re-renders
  const value = useMemo(() => ({
    authStatus,
    signIn,
    signOut,
  }), [authStatus]);

  return (
    <AuthContext.Provider value={value}>
      {authStatus === AuthStatus.Loading ? null : children}
    </AuthContext.Provider>
  );
};

// Component to render content only when the user is signed in
const AuthIsSignedIn = ({ children }) => {
  const { authStatus } = useAuth();
  return <>{authStatus === AuthStatus.SignedIn ? children : null}</>;
};

// Component to render content only when the user is not signed in
const AuthIsNotSignedIn = ({ children }) => {
  const { authStatus } = useAuth();
  return <>{authStatus === AuthStatus.SignedOut ? children : null}</>;
};

// PropTypes for validation
AuthIsSignedIn.propTypes = { children: PropTypes.node };
AuthIsNotSignedIn.propTypes = { children: PropTypes.node };
AuthProvider.propTypes = { children: PropTypes.node };

export { AuthProvider, AuthStatus, AuthIsSignedIn, AuthIsNotSignedIn };
