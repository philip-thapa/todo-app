import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const RedirectRoute = ({ component: Component, isLoggedIn, ...rest }) => {
  return (
    <Route
    {...rest}
    render={props =>
      !isLoggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect to="/home" />
      )
    }
  />)
  };

export default RedirectRoute;