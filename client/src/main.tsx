import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

/**
 * React Application Entry Point
 * 
 * LEARNING NOTES:
 * - This is where React attaches to the DOM
 * - Finds the #root div in index.html
 * - Renders the App component inside it
 * - StrictMode helps catch potential problems in development
 */

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


