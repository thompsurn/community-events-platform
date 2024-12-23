import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import '../styles/styles.css';

function StaffLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignIn = async () => {
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'https://community-events-platform-production.up.railway.app'}/api/staff/login`,
        { username, password }
      );

      const { token } = response.data;

      login(token);
      localStorage.setItem('staffToken', token);

      navigate('/staff-dashboard');
    } catch (err) {
      console.error('Error during staff login:', err);
      setError(err.response?.data?.error || 'Invalid staff username or password');
    }
  };

  return (
    <div className="container">
      <h1>Staff Portal</h1>
      <div className="form">
        {/* Username input */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
          aria-label="Enter your username"
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          aria-label="Enter your password"
        />

        {/* Submit button */}
        <button onClick={handleSignIn} className="button">
          Sign In
        </button>
      </div>

      {/* Display error message if any */}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default StaffLoginPage;
