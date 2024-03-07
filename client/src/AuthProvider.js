import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { AmIAuthenticated } from "./AmIAuthenticated"; // Adjust import path as needed
import PropTypes from 'prop-types'; 

// Constants to replace the AuthStatus enum
const AuthStatus = {
  Loading: 'Loading',
  SignedIn: 'SignedIn',
  SignedOut: 'SignedOut',
};

const AuthContext = createContext({
  authStatus: AuthStatus.Loading,
  signIn: () => {},
  signOut: () => {},
});

// Define the useAuth hook here
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(AuthStatus.Loading);

  useEffect(() => {
    AmIAuthenticated()
      .then(isAuthenticated => {
        setAuthStatus(isAuthenticated ? AuthStatus.SignedIn : AuthStatus.SignedOut);
      })
      .catch(() => setAuthStatus(AuthStatus.SignedOut));
  }, []);

  // Memoize signIn function
  const signIn = useCallback(() => {
    // Your signIn logic
    setAuthStatus(AuthStatus.SignedIn);
  }, []); // Add dependencies here if signIn logic depends on any external values

  // Memoize signOut function
  const signOut = useCallback(() => {
    // Your signOut logic
    setAuthStatus(AuthStatus.SignedOut);
  }, []); 

  const value = useMemo(() => ({
    authStatus,
    signIn,
    signOut,
  }), [authStatus, signIn, signOut]);

  return (
    <AuthContext.Provider value={value}>
      {authStatus === AuthStatus.Loading ? null : children}
    </AuthContext.Provider>
  );
};

const AuthIsSignedIn = ({ children }) => {
  const { authStatus } = useAuth();
  return <>{authStatus === AuthStatus.SignedIn ? children : null}</>;
};

const AuthIsNotSignedIn = ({ children }) => {
  const { authStatus } = useAuth();
  return <>{authStatus === AuthStatus.SignedOut ? children : null}</>;
};

AuthIsSignedIn.propTypes = {
  children: PropTypes.node
};

AuthIsNotSignedIn.propTypes = {
  children: PropTypes.node
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export { AuthProvider, AuthStatus, AuthIsSignedIn, AuthIsNotSignedIn };
