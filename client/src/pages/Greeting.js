import React, { useContext } from 'react';
import StoreContext from '../store/StoreContext';

const Greeting = () => {
  const { state } = useContext(StoreContext);

  console.log(state)

  return (
    <div>
      {state.user ? <h1>Hello, {state.user.name}</h1> : <p>Loading user info...</p>}
    </div>
  );
};

export default Greeting;