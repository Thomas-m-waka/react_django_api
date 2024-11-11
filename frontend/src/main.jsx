import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter
import App from './App';

// Create the root using `createRoot()`
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app inside the root wrapped in BrowserRouter
root.render(
  <React.StrictMode>
    <BrowserRouter>  {/* Wrap your app in BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
