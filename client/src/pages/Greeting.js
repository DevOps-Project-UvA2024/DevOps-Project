import React, { useEffect, useState } from 'react';

const Greeting = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Fetch user info from the backend
    fetch('/api/users/user/user-info', {
      credentials: 'include' // Important for including cookies in the request
    })
    .then(response => response.json())
    .then(data => {
      setUserName(data.username); // Assuming 'name' is the attribute holding the user's name
    })
    .catch(error => console.error('Error fetching user info:', error));
  }, []);

  return (
    <div>
      {userName ? <h1>Hello, {userName}</h1> : <p>Loading user info...</p>}
    </div>
  );
};

export default Greeting;