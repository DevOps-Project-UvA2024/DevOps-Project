// StoreProvider.js
import React, { useReducer } from 'react';
import StoreContext from './StoreContext';
import { reducer, initialState } from './reducer';

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
