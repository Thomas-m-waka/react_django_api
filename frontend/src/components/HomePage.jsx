// src/components/HomePage.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'  // Import Navbar
import Footer from './Footer'  // Import Footer
import Landing from './Landing'

function HomePage() {
  return (
    <div>
        <Navbar/>
        <Landing/>
        <Footer/>
    </div>
)
}

export default HomePage

