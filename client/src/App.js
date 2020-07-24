import React from 'react';
import {
  Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home';
import ProtectRoute from './components/ProtectRoute';
import {history} from './helpers/history';

// import socketIOClient from "socket.io-client";
// const socket = socketIOClient('http://localhost:3001');

const App = () => {
  return (
    <Router history={history}>
      <Switch>
        <ProtectRoute exact={true} path="/">
          <Home/>
        </ProtectRoute>
        <Route path="/login">
          <Login/>
        </Route>
      </Switch>
    </Router>
  )
};

export default App;
