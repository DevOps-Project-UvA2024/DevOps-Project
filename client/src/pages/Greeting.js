import React, { useContext } from 'react';
import StoreContext from '../store/StoreContext';
import Subscriptions from './Subscriptions';

// Component that displays a greeting message to the user and lists their subscriptions.
const Greeting = () => {
  const { state } = useContext(StoreContext); // Access global state to get user information.

  return (
    <div className='greeting-container'>
      {/* Display a welcome message if user info is available, otherwise show a loading message. */}]
      {state.user ? <h2>Welcome back, {state.user.username}</h2> : <p>Loading user info...</p>}
      <Subscriptions />
    </div>

  );
};

export default Greeting;