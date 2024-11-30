import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

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

      // Redirect to homepage after successful login
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Welcome to Community Events!</h1>
      <p>Find out about what events are coming up near you!</p>
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
        <button onClick={() => navigate('/create-account')} style={styles.button}>
          Create Account
        </button>
        <p>
          <Link to="/staff-login" style={styles.link}>
            Click here to go to staff sign in
          </Link>
        </p>
      </div>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: { textAlign: 'center', marginTop: '50px' },
  form: { display: 'inline-block', textAlign: 'left' },
  input: { display: 'block', margin: '10px 0', padding: '10px', width: '100%' },
  button: { margin: '10px 0', padding: '10px 20px', cursor: 'pointer' },
  link: { color: '#007BFF', textDecoration: 'none' },
  error: { color: 'red', marginTop: '10px' },
};

export default LoginPage;
