import React, {useState} from 'react';
import axios from 'axios';
import {login} from '../lib/api';

const style = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  div: {
    width: 30+'%'
  },
  input: {
    margin: 10,
    width: 100+'%'
  }
}

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handlerOnSubmit = () => {
    login({name, password});
  }

  return (
    <div style={style.container}>
      <div style={style.div}>
      <input onChange={(e) => setName(e.target.value)} style={style.input} type="text" placeholder='login'/>
      <input onChange={(e) => setPassword(e.target.value)} style={style.input} type="password"/>
      <input onClick={handlerOnSubmit} style={style.input} type="submit"/>
      </div>
    </div>
  )
}

export default Login;
