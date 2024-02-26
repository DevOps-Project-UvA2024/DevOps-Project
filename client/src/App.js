import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn'
import Verification from './pages/Verification'
import 'antd/dist/reset.css'
import {AuthProvider} from './AuthProvider';
import PrivateRoute from './PrivateRoute';
import NavBar from './pages/NavBar';
import Greeting from './pages/Greeting';
import PasswordReset from './pages/PasswordReset';
import Courses from './pages/Courses';
import Acc from './pages/Account';
import WithNavBar from './pages/WithNavBar';
import WithoutNavBar from './pages/WithoutNavBar';

const App = () => {
  
  
  return (
    <>
    <div className="container">
       
    
      <AuthProvider>
        <Routes>
        <Route element={<WithoutNavBar />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route path="/verify-account" element={<Verification />} />
          </Route>



          <Route element={<WithNavBar />}>
            
            <Route element={<PrivateRoute />}>
              <Route path="/greeting" element={<Greeting />} />
              <Route path="/courses" element={<Courses />} /> 
              <Route path="/account" element={<Acc />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
   
    </div>
    </>
  );
};

export default App;



