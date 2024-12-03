import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/styles.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });

      navigate('/'); // Redirect to homepage after successful login
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container">
      <h1>Welcome to Community Events!</h1>
      <p>Find out about what events are coming up near you!</p>
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
        <button onClick={handleSignIn} className="button">
          Sign In
        </button>
        <button onClick={() => navigate('/create-account')} className="button">
          Create Account
        </button>
        <p>
          <Link to="/staff-login" className="link">
            Click here to go to staff sign in
          </Link>
        </p>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default LoginPage;
