// StoreProvider.js
import React, { useReducer, useMemo } from 'react';
import StoreContext from './StoreContext';
import { reducer, initialState } from './reducer';
import PropTypes from 'prop-types'; 

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

StoreProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default StoreProvider;
