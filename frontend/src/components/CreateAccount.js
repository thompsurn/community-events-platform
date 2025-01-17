import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateAccount() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleCreateAccount = async (e) => {
    e.preventDefault();
  
    setError('');
  
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.'
      );
      return;
    }
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      await axios.post(
        'https://community-events-platform-production.up.railway.app/api/create-account',
        { username, password }
      );
  
      navigate('/login');
    } catch (err) {
      console.error(err);
  
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); 
      } else {
        setError('Failed to create account. Please try again.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Create an Account</h1>
      <form onSubmit={handleCreateAccount} style={styles.form}>
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Create Account</button>
      </form>
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
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  error: {
    marginTop: '10px',
    color: 'red',
    fontSize: '14px',
    textAlign: 'center',
  },
};

export default CreateAccount;
