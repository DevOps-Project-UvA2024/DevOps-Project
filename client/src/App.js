// src/App.js or wherever you define your routes
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AuthProvider} from './AuthProvider';
import PrivateRoute from './PrivateRoute';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Greeting from './pages/Greeting';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route element={<PrivateRoute />}>
            {/* Nested routes inside ProtectedRoute will require authentication */}
            <Route path="/greeting" element={<Greeting />} />
            {/* Add more protected routes here */}
          </Route>
          {/* Define other public routes as needed */}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
