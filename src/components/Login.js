// src/components/Login.js
import React, { useState } from 'react';
import API from '../api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('http://localhost:5000/login', {
        username,
        password,
      });
      window.location.href = './dashboard';
      localStorage.setItem('token', response.data.access_token);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
