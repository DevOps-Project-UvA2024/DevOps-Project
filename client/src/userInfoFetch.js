import { useContext, useEffect } from 'react';
import StoreContext from './store/StoreContext';

const useFetchUserInfo = () => {
  const { dispatch } = useContext(StoreContext);

  useEffect(() => {
    // Fetch user info from the backend
    fetch('/api/users/user/user-info', {
      credentials: 'include' // Important for including cookies in the request
    })
    .then(response => response.json())
    .then(data => {
        dispatch({ type: 'SET_USER_INFO', payload: data });
    })
    .catch(error => console.error('Error fetching user info:', error));
  }, [dispatch]);
};

export default useFetchUserInfo;
