import React from 'react';

function PaystackButton({ amount, selectedServices }) {
  const paystackPublicKey = 'pk_live_3a31ece37db05b6f8bb00dd0fc1d01891fe58aae';  // Your public key here
  const paymentRef = `paystack_${new Date().getTime()}`;  // Generate a unique payment reference for each transaction

  const handlePayment = () => {
    const handler = window.PaystackPop.setup({
      key: paystackPublicKey,
      email: 'user@example.com',  // Use the logged-in user's email here (you might want to fetch it from the user's profile)
      amount: amount * 100,  // Paystack expects the amount in kobo (i.e. multiply by 100)
      ref: paymentRef,  // Unique reference for the transaction
      metadata: {
        selected_services: selectedServices,  // You can also send the selected services with the metadata if needed
      },
      callback: function(response) {
        // Handle the response from Paystack after the payment is made
        console.log('Payment successful: ', response);
        alert('Payment was successful!');
        // You can now make a POST request to your Django backend to record the appointment
      },
      onClose: function() {
        alert('Transaction was canceled!');
      },
    });

    handler.openIframe();  // Open the Paystack payment modal
  };

  return (
    <div>
      <button onClick={handlePayment}>Pay with Paystack</button>
    </div>
  );
}

export default PaystackButton;
