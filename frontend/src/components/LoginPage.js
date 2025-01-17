import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignIn = async () => {
    setError('');
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      const { token } = response.data;
      login(token);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Community Events!</h1>
      <div style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSignIn} style={styles.button}>
          Sign In
        </button>
        <Link to="/create-account" style={styles.link}>
          Create an account
        </Link>
      </div>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: '20px',
  },
  heading: {
    marginBottom: '20px',
    color: '#343a40',
    fontSize: '24px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  input: {
    marginBottom: '15px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    outline: 'none',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginBottom: '10px',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  link: {
    textAlign: 'center',
    color: '#007bff',
    textDecoration: 'none',
    fontSize: '14px',
    marginTop: '10px',
  },
  error: {
    marginTop: '15px',
    color: 'red',
    fontSize: '14px',
    textAlign: 'center',
  },
};

export default LoginPage;
