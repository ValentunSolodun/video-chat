import axios from 'axios';

let host = 'http://192.168.0.104:3001';

if (process.env.NODE_ENV === 'production') {
  host = '';
}

export const getCreatedSession = async () => {
  const response = await axios.get(`${host}/create-session`);
  const data = response.data;
  return data;
}
