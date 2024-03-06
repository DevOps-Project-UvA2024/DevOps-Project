// StoreProvider.js
import React, { useReducer } from 'react';
import StoreContext from './StoreContext';
import { reducer, initialState } from './reducer';
import PropTypes from 'prop-types'; // Import PropTypes

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

StoreProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default StoreProvider;
