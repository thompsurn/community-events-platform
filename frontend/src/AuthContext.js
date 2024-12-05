import React, { createContext, useContext, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Correctly import jwtDecode

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('staffToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded); // Debug log
        return decoded;
      } catch (err) {
        console.error('Failed to decode token:', err.message);
      }
    }
    return null;
  });

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token); // Ensure this includes role
    console.log('Decoded token during login:', decoded); // Debug log
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('staffToken');
    setUser(null);
    // Redirect after logout
    if (user?.role === 'staff') {
      window.location.href = '/staff-login'; // Redirect staff to staff login
    } else {
      window.location.href = '/login'; // Redirect users to login
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
