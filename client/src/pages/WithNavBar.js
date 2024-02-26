import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar'; 

const WithNavBar = () => (
  <>
    <NavBar />
    <div className="container">
      <Outlet />
    </div>
  </>
);

export default WithNavBar;
