import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaystackPayment = ({ user, selectedServices }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  // Calculate total amount from selected services
  const calculateTotalPrice = () => {
    return selectedServices.reduce((total, service) => total + parseFloat(service.price), 0);
  };

  const totalPrice = calculateTotalPrice();  // Get total price of selected services

  const handlePayment = async () => {
    setIsLoading(true);

    // Prepare Paystack payment config
    const paystackConfig = {
      reference: new Date().getTime().toString(),  // Unique transaction reference
      email: user.email,  // User's email
      amount: totalPrice * 100,  // Paystack expects amount in kobo (multiply by 100)
      publicKey: 'pk_live_3a31ece37db05b6f8bb00dd0fc1d01891fe58aae',  // Paystack public key
      currency: 'KES',  // Currency (KES for Kenyan Shillings)
      metadata: {
        name: user.name,
        phone: user.phone
      }
    };

    // Initialize Paystack payment gateway
    const paystack = new window.PaystackPop();
    paystack.newTransaction(paystackConfig, (status, reference) => {
      if (status === "success") {
        // Payment successful, send details to backend for appointment creation
        sendPaymentDetailsToBackend(reference);
      } else {
        // Payment failed
        console.error("Payment failed!");
        setPaymentSuccess(false);
        setIsLoading(false);
      }
    });
  };

  // Send payment details to the backend for verification and appointment creation
  const sendPaymentDetailsToBackend = async (reference) => {
    try {
      // Backend API call to verify payment and create appointment
      const response = await axios.post('/api/payment/verify/', {
        reference,
        user_id: user.id,  // The logged-in user's ID
        service_ids: selectedServices.map(service => service.id)  // IDs of the selected services
      });

      console.log('Payment verification response:', response.data);
      setPaymentSuccess(true);  // Set success flag to display success message
    } catch (error) {
      console.error('Error verifying payment:', error);
      setPaymentSuccess(false);  // If verification fails, mark as failed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3>Total Amount: KES {totalPrice}</h3>
      
      {/* Show success or failure message */}
      {paymentSuccess === true && <p>Payment successful! Your appointment has been created.</p>}
      {paymentSuccess === false && <p>Payment failed. Please try again.</p>}
      
      <button 
        onClick={handlePayment} 
        disabled={isLoading || paymentSuccess === true}  // Disable button if payment is in progress or successful
      >
        {isLoading ? 'Processing Payment...' : 'Pay with Paystack'}
      </button>
    </div>
  );
};

export default PaystackPayment;
