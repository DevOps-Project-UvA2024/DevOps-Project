import React from 'react';
import MessageDisplay from './pages/MessageDisplay'; // Import the component
import MessageDisplay2 from './pages/MessageDisplay2';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MessageDisplay /> 
        <MessageDisplay2 /> 
      </header>
    </div>
  );
}

export default App;
