import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import SignIn from '../../pages/SignIn/SignIn';
import SignUp from '../../pages/SignUp/SignUp';
import PrivateRoute from './PrivateRoute';
import Home from '../../pages/Home/Home';
import { useSelector } from 'react-redux';
import RedirectRoute from './RedirectRoute';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import ForgotPassword from '../../pages/ForgotPassword/ForgotPassword';

const Routes = () => {
  const {isLoggedIn} = useSelector(store => store.authReducer)

  useEffect(() => {

  }, [isLoggedIn])

  return (
    <BrowserRouter>
      <Switch>
        <RedirectRoute path="/signin" exact component={SignIn} isLoggedIn={isLoggedIn} />
        <PrivateRoute path="/home" exact component={Home} isLoggedIn={isLoggedIn} />
        <RedirectRoute path="/signup" exact component={SignUp} />
        <RedirectRoute path="/forgot-password" exact component={ForgotPassword} />
        <Redirect from="/" to="/signin" />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;