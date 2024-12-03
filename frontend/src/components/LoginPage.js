import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import '../styles/styles.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      const { token } = response.data;
      login(token); // Use the context login function
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container">
      <h1>Welcome to Community Events!</h1>
      <div className="form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        <button onClick={handleSignIn} className="button">Sign In</button>
        <Link to="/create-account" className="link">Create an account</Link>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default LoginPage;
