import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import ServicesPage from './components/ServicesPage';
import PaymentPage from './components/PaymentPage';  
import Appointments from './components/Appointment';
import ServicesComponent from './components/Services';
import Contact from './components/Contact';


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Make sure / route is defined */}
        <Route path="/login" element={<LoginPage />} /> {/* /login route */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/payment" element={<PaymentPage />} /> {/* Add the payment route here */}
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/contact" element={<ServicesComponent />} />
        <Route path="/contact-us" element={<Contact />} />

      </Routes>
    </div>
  );
}

export default App;




