import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import '../styles/styles.css';

function StaffLoginPage() {
  // State variables for username, password, and error messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Handle staff login form submission
  const handleSignIn = async () => {
    // Validate that both username and password are provided
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      // Make API call to login endpoint
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'https://community-events-platform-production.up.railway.app'}/api/staff/login`,
        { username, password }
      );

      const { token } = response.data;

      // Save token to local storage and update context
      login(token); // Context login
      localStorage.setItem('staffToken', token);

      // Navigate to staff dashboard on successful login
      navigate('/staff-dashboard');
    } catch (err) {
      // Log error and set appropriate error message for display
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
