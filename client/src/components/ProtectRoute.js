import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import Home from './Home';


const ProtectRoute = ({path, exact, children}) => {
  if(JSON.parse(localStorage.getItem('user'))) {
    return (
      <Route exact={exact} path={path}>
        {children}
      </Route>
    )
  }
  return <Redirect to="/login" />
}

export default ProtectRoute
