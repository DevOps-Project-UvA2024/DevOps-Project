import React from 'react';
// eslint-disable-next-line
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn'
import Verification from './pages/Verification'
import 'antd/dist/reset.css'
import {AuthProvider} from './AuthProvider';
import PrivateRoute from './PrivateRoute';
import Greeting from './pages/Greeting';
import PasswordReset from './pages/PasswordReset';
import Courses from './pages/Courses';
import WithNavBar from './components/WithNavBar';
import WithoutNavBar from './components/WithoutNavBar';
import Course from './pages/Course';
import CourseAnalytics from './pages/CourseAnalytics';

const App = () => {
  
  return (
    <div className="container">
      
      <AuthProvider>
        <Routes>
          {/* Redirect plain "/" url to sign in url */}
          <Route path="/" element={<Navigate replace to="/signin" />} />

          {/* The following pages do not have a navbar */}
          <Route element={<WithoutNavBar />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route path="/verify-account" element={<Verification />} />
          </Route>

          {/* The following pages have a navbar */}
          <Route element={<WithNavBar />}>
            {/* The following pages are available only to logged in users */}
            <Route element={<PrivateRoute />}>
              <Route path="/greeting" element={<Greeting />} />
              <Route path="/courses" element={<Courses />} /> 
              <Route path="/courses/:courseid" element={<Course />} />
              <Route path="/courses/:courseid/course-analytics" element={<CourseAnalytics />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
   
    </div>
  );
};

export default App;



