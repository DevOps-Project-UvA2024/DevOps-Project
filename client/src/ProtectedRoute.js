// In your ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch('/api/check-logged-in')
      .then(res => res.json())
      .then(data => setIsAuthenticated(data.isAuthenticated))
      .catch(error => console.error("Auth check failed:", error));
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;