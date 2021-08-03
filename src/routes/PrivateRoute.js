import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();
  const history = useHistory();
  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser ? (
          <Component {...props} />
        ) : (
          history.push({
            pathname: '/',
            message: 'Please log in to access this page.',
          })
        );
      }}
    ></Route>
  );
}
