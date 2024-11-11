import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVICE_LIST_URL, USER_PROFILE_URL, PAYMENT_VERIFY_URL } from '../constants/api'; // Ensure the correct API URLs

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null); // To store the selected service ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const [user, setUser] = useState(null); // User details from profile API
  const navigate = useNavigate(); // to navigate to the payment page

  // Fetch user profile details when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('accessToken'); // Get token from localStorage
    if (!token) {
      navigate('/login'); // If there's no token, redirect to login
    } else {
      setIsAuthenticated(true); // If token exists, assume user is authenticated
    }
  }, [navigate]);

  // Fetch user profile and services data after authentication
  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserProfile = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          if (!token) {
            throw new Error('No token found');
          }

          // Send GET request to fetch user profile
          const userResponse = await axios.get(USER_PROFILE_URL, {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the Authorization header
            },
          });

          setUser(userResponse.data); // Set user data to state

          // Fetch services after getting the user profile
          const servicesResponse = await axios.get(SERVICE_LIST_URL, {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the Authorization header
            },
          });

          setServices(servicesResponse.data); // Set services data to state
        } catch (error) {
          console.error('Error fetching profile or services:', error);
          setError('Error fetching profile or services. Please try again later.');
        } finally {
          setLoading(false); // Set loading to false after the requests finish
        }
      };

      fetchUserProfile(); // Call the function to fetch user profile and services
    }
  }, [isAuthenticated]); // Only fetch data if authenticated

  // Handle service selection (single service)
  const handleSelectService = (serviceId) => {
    setSelectedServiceId(serviceId); // Store the selected service ID
  };

  // Helper to format the amount (KES)
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-Kenya', {
      style: 'currency',
      currency: 'KES',
    }).format(amount / 100); // Convert back from kobo to KES (divide by 100)
  };

  // Proceed to Paystack payment
  const handleProceedToPayment = () => {
    if (!selectedServiceId) {
      alert('Please select a service to proceed.');
      return;
    }

    // Find the selected service
    const selectedService = services.find(service => service.id === selectedServiceId);
    if (!selectedService) {
      alert('Selected service not found.');
      return;
    }

    const totalAmount = parseFloat(selectedService.price);

    if (typeof window !== 'undefined' && window.PaystackPop) {
      const paystack = window.PaystackPop; // Paystack object is available globally
      const handler = paystack.setup({
        key: 'pk_live_3a31ece37db05b6f8bb00dd0fc1d01891fe58aae', // Replace with your Paystack public key
        email: user.email,
        amount: totalAmount * 100, // Paystack expects the amount in kobo (100 kobo = 1 KES)
        name: user.username,
        phone: user.phone, // Pass the correctly formatted phone number
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

  // Send reference to backend to verify the payment
  const verifyPayment = async (reference) => {
    try {
      // Get the access token from localStorage
      const accessToken = localStorage.getItem('accessToken');

      // Get the CSRF token from cookies
      const csrfToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
      
      if (csrfToken) {
        // Extract the CSRF token value from the cookie string
        const csrfTokenValue = csrfToken.split('=')[1];
        console.log('CSRF Token:', csrfTokenValue);  // Log the CSRF token to the console
      } else {
        console.log('CSRF Token not found');
      }

      // Check if accessToken and csrfToken are available
      if (!accessToken || !csrfToken) {
        throw new Error('Missing access token or CSRF token');
      }

      // Prepare the headers with both accessToken and csrfToken
      const headers = {
        'X-CSRFToken': csrfToken.split('=')[1],  // Attach CSRF token from cookie
        'Authorization': `Bearer ${accessToken}`  // Include Bearer token for authentication
      };

      // Send the payment reference and selected service ID to the backend for verification
      const response = await axios.post(PAYMENT_VERIFY_URL, { reference, service_id: selectedServiceId }, { headers });

      if (response.data.status === 'success') {
        alert('Payment successfully verified!');
        navigate('/'); // Redirect to success page or wherever you want
      } else {
        alert('Payment verification failed.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('An error occurred during payment verification.');
    }
  };

  // If loading, show a loading message
  if (loading) {
    return <div>Loading services...</div>;
  }

  // If there's an error, show error message
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="services-page px-5 py-24 mx-auto">
    <h2 className="text-3xl font-semibold mb-6">Available Services</h2>
    <div className="services-list flex flex-wrap -m-4">
      {services.length > 0 ? (
        services.map((service) => (
          <div key={service.id} className="service-item lg:w-1/4 md:w-1/2 p-4 w-full">
            <div className="block relative h-48 rounded overflow-hidden">
              {/* Display image if available */}
              {service.image && (
                <img
                  src={service.image} // Correct image URL
                  alt={service.title}
                  className="object-cover object-center w-full h-full block"
                  style={{ width: '100%', height: 'auto' }}
                />
              )}
            </div>
  
            <div className="mt-4">
              <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">{service.category}</h3>
              <h2 className="text-gray-900 title-font text-lg font-medium">{service.title}</h2>
              <p className="mt-1">{service.description}</p>
              <p className="mt-1">Price: KES {service.price}</p>
  
              {/* Radio button for selecting a service (only one service at a time) */}
              <div>
                <label className="text-sm">
                  <input
                    type="radio"
                    checked={selectedServiceId === service.id} // Check if this service is selected
                    onChange={() => handleSelectService(service.id)} // Select service
                    className="mr-2 leading-tight"
                  />
                  Select
                </label>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No services available.</p>
      )}
    </div>
  
    <button
      onClick={handleProceedToPayment}
      className="mt-6 px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600"
    >
      Proceed to Payment
    </button>
  </div>
  
  );
}

export default ServicesPage;


















