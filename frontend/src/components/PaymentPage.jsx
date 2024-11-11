import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_PROFILE_URL } from '../constants/api'; // Ensure this points to the correct URL
import { calculateTotalAmount } from '../utils/amountCalculator'; // Helper function to calculate total (if needed)

const PaymentPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]); // State for selected services
  const [paystackLoaded, setPaystackLoaded] = useState(false); // State to track Paystack script loading
  const navigate = useNavigate();

  // Fetch user profile when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      navigate('/login');  // Redirect to login if no token is found
      return;
    }

    const fetchUserProfile = async () => {
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

    fetchUserProfile();

    // Assuming the selected services are stored in localStorage or context
    const services = JSON.parse(localStorage.getItem('selectedServices')) || [];
    setSelectedServices(services);

  }, [navigate]);

  // Wait for the Paystack script to load before setting the state
  useEffect(() => {
    if (window.PaystackPop) {
      setPaystackLoaded(true); // Mark Paystack script as loaded
    }
  }, []);

  // Hard-code the total amount to 2 KES (200 kobo)
  const totalAmount = 2 * 100; // 1 KES is 100 kobo (2 KES is 200 kobo)

  // Format phone number to ensure it is 10 digits and starts with 0 (local format)
  const formatPhoneNumber = (phone) => {
    if (!phone) return ''; // If no phone number, return empty

    // Remove non-numeric characters
    phone = phone.replace(/\D/g, '');

    // Check if phone number starts with country code (+254) for Kenya, and replace with '0'
    if (phone.startsWith('254') && phone.length === 12) {  // Checking for +254
      return '0' + phone.slice(3); // Remove the country code and prepend '0'
    }

    // If the phone number is already in local format (e.g., '0701234567'), return it as is
    if (phone.length === 10 && phone.startsWith('0')) {
      return phone;
    }

    return ''; // Invalid phone number
  };

  // Handle payment
  const handlePayment = () => {
    if (paystackLoaded && user && totalAmount > 0) {
      // Format the phone number before proceeding with the payment
      const formattedPhone = formatPhoneNumber(user.phone_number);

      // If the phone number is invalid, alert the user
      if (!formattedPhone) {
        alert('Please enter a valid phone number (starting with 0 and 10 digits long).');
        return;
      }

      // Proceed with Paystack payment
      const paystack = window.PaystackPop; // Now PaystackPop is available

      const handler = paystack.setup({
        key: 'pk_live_3a31ece37db05b6f8bb00dd0fc1d01891fe58aae', // Replace with your Paystack public key
        email: user.email,
        amount: totalAmount, // Paystack expects the amount in kobo (100 kobo = 1 KES)
        name: user.username,
        phone: formattedPhone, // Pass the correctly formatted phone number
        currency: 'KES',
        ref: `ref-${new Date().getTime()}`, // Generate a unique reference number
        callback: function(response) {
          console.log("Payment successful", response);
          // Send the payment reference to the backend for verification
          verifyPayment(response.reference);
        },
        onClose: function() {
          console.log('Payment window closed');
        }
      });

      handler.openIframe(); // Open the Paystack iframe for payment
    } else {
      alert("Paystack is not ready or total amount is invalid.");
    }
  };

  // Helper to format the amount (KES)
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-Kenya', {
      style: 'currency',
      currency: 'KES',
    }).format(amount / 100); // Convert back from kobo to KES (divide by 100)
  };

  // Send reference to backend to verify the payment
  const verifyPayment = async (reference) => {
    try {
      const response = await axios.post('/payment/verify/', { reference });
      if (response.data.status === 'success') {
        // Handle successful payment verification
        alert('Payment successfully verified!');
      } else {
        // Handle failed verification
        alert('Payment verification failed.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('An error occurred during payment verification.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="payment-page">
      <h2>Payment Page</h2>
      
      {/* Show the list of selected services and their prices */}
      <div>
        <h3>Selected Services:</h3>
        <ul>
          {selectedServices.length > 0 ? (
            selectedServices.map((service, index) => (
              <li key={index}>
                {service.name} - {formatAmount(service.price)}
              </li>
            ))
          ) : (
            <p>No services selected.</p>
          )}
        </ul>
      </div>

      {/* Show the total amount */}
      <div>
        <h3>Total Amount: {formatAmount(totalAmount)}</h3>
      </div>

      {/* Pay Now Button */}
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default PaymentPage;









