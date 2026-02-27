import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1a1a2e',
          color: '#f1f5f9',
          border: '1px solid #2d2d42',
        },
        success: { iconTheme: { primary: '#10b981', secondary: '#1a1a2e' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#1a1a2e' } },
        duration: 4000,
      }}
    />
  </React.StrictMode>
);
