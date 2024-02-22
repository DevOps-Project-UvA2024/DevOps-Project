import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Masters from './pages/MastersList';
import 'antd/dist/reset.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signin/masters-list" element={<Masters />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;



