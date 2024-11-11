import React, { useState } from 'react';
import { REGISTER_URL } from '../constants/api'; // Import the REGISTER_URL constant
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function RegisterPage() {
  const navigate = useNavigate(); // Create navigate function to programmatically navigate after successful registration
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');  // State for phone number
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(REGISTER_URL, {
        username,
        email,
        password,
        userprofile: {
          phone_number: phoneNumber,  // Include phone number in userprofile
        },
      });

      console.log('Registration successful:', response.data);
      // Redirect to login page after successful registration
      navigate('/login');
    } catch (error) {
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Add Phone Number field */}
        <div>
          <label>Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        {errorMessage && <p>{errorMessage}</p>}
        <button type="submit">Register</button>
      </form>

      {/* Login URL Link */}
      <div>
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
}

export default RegisterPage;



