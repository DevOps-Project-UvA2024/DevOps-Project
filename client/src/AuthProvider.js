import React, { createContext, useContext, useEffect, useState } from "react";
import { AmIAuthenticated } from "./AmIAuthenticated"; // Adjust import path as needed

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

  function signIn() {
    // Your signIn logic
    setAuthStatus(AuthStatus.SignedIn);
  }

  function signOut() {
    // Your signOut logic
    setAuthStatus(AuthStatus.SignedOut);
  }

  const value = {
    authStatus,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {authStatus === AuthStatus.Loading ? null : children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthStatus };

export const AuthIsSignedIn = ({ children }) => {
  const { authStatus } = useAuth();
  return <>{authStatus === AuthStatus.SignedIn ? children : null}</>;
};

export const AuthIsNotSignedIn = ({ children }) => {
  const { authStatus } = useAuth();
  return <>{authStatus === AuthStatus.SignedOut ? children : null}</>;
};
