import React from 'react';
import ReactDOM from 'react-dom';
import '@opentok/client';
import {getCreatedSession} from './lib/api';
import App from './App';
import './index.css';

import {
  API_KEY,
  SESSION_ID,
  TOKEN
} from './config';

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);


// if (API_KEY && TOKEN && SESSION_ID) {
//   renderApp({
//     apiKey: API_KEY,
//     sessionId: SESSION_ID,
//     token: TOKEN,
//   });
// }
