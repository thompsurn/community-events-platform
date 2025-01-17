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
    <div className="container">
      <h1>Create an Account</h1>
      <form onSubmit={handleCreateAccount}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Create Account</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default CreateAccount;
