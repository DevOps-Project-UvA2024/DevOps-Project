import React, { useContext } from 'react';
import StoreContext from '../store/StoreContext';
import Subscriptions from './Subscriptions';

const Greeting = () => {
  const { state } = useContext(StoreContext);

  return (
    <div>
      {state.user ? <h1>Hello, {state.user.username}</h1> : <p>Loading user info...</p>}
      <Subscriptions />
    </div>
  );
};

export default Greeting;