// src/components/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LOGIN_URL } from '../constants/api'; // The login endpoint

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send login request to Django API to get the tokens
      const response = await axios.post(LOGIN_URL, {
        username,
        password,
      });

      // Assuming the response contains the access and refresh tokens
      if (response.data.access && response.data.refresh) {
        // Store the tokens in localStorage
        localStorage.setItem('accessToken', response.data.access); // Store access token
        localStorage.setItem('refreshToken', response.data.refresh); // Store refresh token

        // Redirect to the dashboard or home page
        navigate('/dashboard');
      } else {
        setErrorMessage('Failed to retrieve tokens. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
  
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="Enter your username"
              required
            />
          </div>
  
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="Enter your password"
              required
            />
          </div>
  
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded mt-4 hover:bg-blue-600 transition duration-300"
          >
            Log In
          </button>
        </form>
  
        {/* Register Link */}
        <div className="text-center mt-4">
          <p>
            Don't have an account?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
  
}

export default LoginPage;





