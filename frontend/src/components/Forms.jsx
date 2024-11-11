import React, { useState } from 'react';
import './Forms.css';
import emailjs from '@emailjs/browser';

const SubscribeForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      // Save subscriber to the database
      const response = await fetch('http://localhost:8000/api/userprofile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        throw new Error('Failed to save subscriber');
      }

      // Proceed to emailjs
      const templateParams = {
        name,
        couponCode: generateCouponCode(),
      };

      emailjs.send('service_k0geb9b', 'template_c2xlabi', templateParams, { publicKey: 'nLAv_Dh9dVlpHnNUK' })
        .then(response => {
          console.log('SUCCESS!', response.status, response.text);
          setSubscribed(true);
        }, error => {
          console.error('FAILED...', error);
          setError('Failed to send email. Please try again');
        });
    } catch (error) {
      console.error('Failed to save subscriber', error);
      setError('Failed to subscribe. Please try again');
    }
  };

  // Coupon code generator
  const generateCouponCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  return (
    <div className="subscribe-form-container">
      <div className="subscribe-form">
        <h2>Subscribe to Mailing List for 50% Discount</h2>
        {subscribed ? (
          <div>
            <p>Check your email for the coupon to use at checkout.</p>
            <button className="book-now-btn" onClick={() => (window.location.href = '/booking')}>
              Proceed to Booking
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubscribe}>
            <div className="input-group">
              <label htmlFor="name">Name *:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email *:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>
            <button type="submit" className="subscribe-btn">
              Subscribe
            </button>
            {error && <p className='error-message'>{error}</p>}
          </form>
        )}
      </div>
    </div>
  )
}

export default SubscribeForm