import React, { useState, useEffect } from 'react';

function MessageDisplay() {
  const [message, setMessage] = useState('Loading message...');

  useEffect(() => {
    // Fetch the message from the Express backend
    fetch('/api/new-message')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => {
        console.error('Error fetching message:', error);
        setMessage('Failed to load message.');
      });
  }, []); // The empty array ensures this effect runs only once after initial render

  return (
    <div>
      <h2>Message from Express:</h2>
      <p>{message}</p>
    </div>
  );
}

export default MessageDisplay;
