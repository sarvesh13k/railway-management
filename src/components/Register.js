// src/components/Register.js
import React, { useState } from 'react';
import API from '../api';
import './Register.css'

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('http://localhost:5000/register', {
        username,
        password,
        role,
      });
      window.location.href = './Login'
    } catch (error) {
      alert('Registration failed.');
    }
  };

  return (
    <form onSubmit={handleRegister}>
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
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
