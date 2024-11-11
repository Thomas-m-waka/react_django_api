import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { APPOINTMENTS_URL } from '../constants/api'; // Import the APPOINTMENTS_URL constant

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the token exists
  const token = localStorage.getItem('accessToken'); // Make sure this is the correct key

  useEffect(() => {
    // If no token, redirect to login
    if (!token) {
      setError('Unauthorized: Please log in first');
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        // Send request with Authorization token
        const response = await axios.get(APPOINTMENTS_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAppointments(response.data); // Set the fetched appointments to state
        setLoading(false);
      } catch (err) {
        setError('Failed to load appointments.');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  // If loading, show a loading message
  if (loading) {
    return <div>Loading appointments...</div>;
  }

  // If there's an error, display an error message
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Your Appointments</h2>
      {appointments.length === 0 ? (
        <p>You don't have any appointments.</p>
      ) : (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id}>
              <h3>{appointment.service.title}</h3>
              <p><strong>Amount Paid:</strong> ${appointment.payment.amount}</p>
              <p><strong>Status:</strong> {appointment.status}</p>
              <p><strong>Appointment Date:</strong> {new Date(appointment.appointment_date).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Appointments;

