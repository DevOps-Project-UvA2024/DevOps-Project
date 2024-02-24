// src/App.js or wherever you define your routes
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AuthProvider} from './AuthProvider';
import PrivateRoute from './PrivateRoute';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Greeting from './pages/Greeting';
import PasswordReset from './pages/PasswordReset';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route element={<PrivateRoute />}>
            <Route path="/greeting" element={<Greeting />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
