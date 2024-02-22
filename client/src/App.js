import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn'
import 'antd/dist/reset.css'
import Greeting from './pages/Greeting';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/greeting" element={<Greeting />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



