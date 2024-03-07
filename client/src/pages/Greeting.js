import React, { useContext } from 'react';
import StoreContext from '../store/StoreContext';
import Subscriptions from './Subscriptions';
import styles from '../styles/greeting_style.css'


const Greeting = () => {
  const { state } = useContext(StoreContext);

  return (
    <div className='greeting-container'>
     
      {state.user ? <h2>Welcome back, {state.user.username}</h2> : <p>Loading user info...</p>}
      <Subscriptions />
    </div>

  );
};

export default Greeting;