import axios from 'axios';
import {history} from '../helpers/history';
import _ from 'lodash';

let host = 'http://localhost:3001';

if (process.env.NODE_ENV === 'production') {
  host = '';
}

export const getCreatedSession = async () => {
  const response = await axios.get(`${host}/create-session`);
  const data = response.data;
  return data;
}

export const login = async (data) => {
  const response = await axios.post(`${host}/login`, data);
  console.log(response)
  if(!_.isEmpty(response)) {
    localStorage.setItem('user', JSON.stringify(response.data))
    history.push('/');
  }
}

// export const deleteSession = async () => {
//   const response = await axios.post(`${host}/delete-session`);
// }
