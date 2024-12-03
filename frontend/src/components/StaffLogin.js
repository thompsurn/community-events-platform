import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

function StaffLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/staff/login', { username, password });
      navigate('/staff-dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="staff-login-container">
      <h1 className="staff-login-title">Staff Login</h1>
      <form onSubmit={handleLogin} className="staff-login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="staff-login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="staff-login-input"
        />
        <button type="submit" className="staff-login-button">
          Login
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default StaffLogin;
