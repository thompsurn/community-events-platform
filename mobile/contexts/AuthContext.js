import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username) => {
    // Hardcoded user object for MVP
    const hardcodedUser = {
      username,
      role: username === 'staffuser' ? 'staff' : 'user', // Example: determine role based on username
    };

    console.log('User logged in:', hardcodedUser);
    setUser(hardcodedUser);
  };

  const logout = () => {
    console.log('User logged out');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
