import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_PROFILE_URL } from '../constants/api';  // Ensure this points to the correct API endpoint

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      navigate('/login');  // Redirect to login if no token is found
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(USER_PROFILE_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);  // Set user data to state
      } catch (error) {
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const token = localStorage.getItem('accessToken');

    if (refreshToken && token) {
      await axios.post('/auth/token/logout/', {
        refresh_token: refreshToken,
      });
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  // If loading, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's an error, display an error message
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {user ? user.username : 'User'}!</h1>  {/* Display the username */}
      <p>Email: {user ? user.email : 'No Email Available'}</p>
      <p>Phone Number: {user && user.phone_number ? user.phone_number : 'No Phone Number Available'}</p>

      <div className="navigation">
        <button onClick={() => navigate('/services')}>View Services</button>
      </div>

      <div className="appointments-section">
        <h2>Your Appointments</h2>
        <button onClick={() => navigate('/appointments')}>View Appointments</button>  {/* Navigate to appointments page */}
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;













