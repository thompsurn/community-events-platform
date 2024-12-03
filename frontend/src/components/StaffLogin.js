import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Ensure this matches the correct file name

function StaffLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Get setUser from context

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/staff/login', {
        username,
        password,
      });
      setUser(response.data); // Set the logged-in user
      navigate('/staff-dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Staff Login</h1>
      <form onSubmit={handleLogin} className="form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
        />
        <button type="submit" className="button">
          Login
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default StaffLogin;
