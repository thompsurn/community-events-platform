import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StaffLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const response = await axios.post('http://localhost:5000/api/staff/login', {
        username,
        password,
      });
      console.log('Login successful:', response.data);
      navigate('/staff-dashboard'); // Redirect to the staff dashboard
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid username or password');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Staff Login</h1>
      <form onSubmit={handleLogin} style={styles.form}>
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
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: { textAlign: 'center', marginTop: '50px' },
  form: { display: 'inline-block', textAlign: 'left' },
  input: { display: 'block', margin: '10px 0', padding: '10px', width: '300px' },
  button: { padding: '10px 20px', cursor: 'pointer', marginTop: '10px' },
  error: { color: 'red', marginTop: '10px' },
};

export default StaffLogin;
