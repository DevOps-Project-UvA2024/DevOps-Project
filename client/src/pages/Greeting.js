import React, { useContext, useState } from 'react';
import StoreContext from '../store/StoreContext';

const Greeting = () => {
  const { state } = useContext(StoreContext);
  // const [downloadUrl] = useState('');

  return (
    <div>
      {state.user ? <h1>Hello, {state.user.username}</h1> : <p>Loading user info...</p>}
    </div>
  );
};

export default Greeting;