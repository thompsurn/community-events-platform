import React from 'react';
import ReactDOM from 'react-dom/client'; // Update to React 18's createRoot
import App from './App';
import { AuthProvider } from './AuthContext'; // Assuming you have AuthProvider for context

const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot instead of ReactDOM.render

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
