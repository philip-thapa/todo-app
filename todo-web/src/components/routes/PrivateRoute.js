import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, isLoggedIn, ...rest }) => {
  return (
    <Route
    {...rest}
    render={props =>
      isLoggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect to="/signin" />
      )
    }
  />)
  };

export default PrivateRoute;