import React, { useState, useRef } from 'react';
import './Landing.css';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import image2 from '../assets/slide2.jpg';
import image1 from '../assets/chemical peel.jpg';
import image3 from '../assets/LED.jpg';
import { FadeLoader } from 'react-spinners';
import { css } from '@emotion/react';
import { useMediaQuery } from 'react-responsive';

const override = css`
    display: block;
    margin: 0 auto;
`;

const spanStyle = {
    padding: '20px',
    background: '#efefef',
    color: '#000000'
}

const divStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    height: '100vh'
}

const fadeImages = [
    image2,
    image1,
    image3
];

const Slideshow = () => {
    const properties = {
        duration: 5000,
        transitionDuration: 1000,
        infinite: true,
        indicators: false,
        arrows: false
    }
    return (
        <div className="slide-container">
            <Fade {...properties}>
                {fadeImages.map((fadeImage, index) => (
                    <div key={index}>
                        <div style={{ ...divStyle, 'backgroundImage': `url(${fadeImage})` }}>
                        </div>
                    </div>
                ))}
            </Fade>
        </div>
    )
}
const Landing = () => {
    const [loading, setLoading] = useState(false)
    const buttonRef = useRef(null)
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

    const handleClick = () => {
        setLoading(true)

        setTimeout(() => {
            setLoading(false)
            //redirect to form
            window.location.href = '/form'//create form for this
        }, 3000)//loading time
    }
    return (
        <div className="landing-bg">
            <Slideshow />

            <div className="landing-container text-white">
                {!isMobile && (
                    <div className="name-location">
                        <h1>BOWANA</h1>
                        <h2>SPA CENTER</h2>
                    </div>
                )}
                <h1 className={isMobile ? 'text-4xl' : 'lg:text-6xl md:text-4xl text-2xl font-semibold mb-4'}>Indulge in Tranquility</h1>
                <p className={isMobile ? 'text-lg p-3' : 'mb-6 lg:p-5'}>Discover our opulent oasis of relaxation</p>
                <a href="/booking" className=" hover:bg-pink-600 text-white py-2 px-6 rounded-full text-lg hover:transition duration-300 ease-in-out"style={{ backgroundColor: '#A2A384' }}>Book A Visit</a>

            </div>

            <div>
                <a className="discount-button hover:text-white py-2 px-6 rounded-full text-lg hover:transition duration-300 ease-in-out" onClick={handleClick}
                    ref={buttonRef}> {loading ? (
                        <>
                            <span>Getting your discount code...</span>
                            <FadeLoader color={"#A5A68A"} loading={loading} css={override} size={10} />
                        </>
                    ) : (
                        <span> Get 50% Off </span>
                    )}
                </a>
            </div>

        </div>
    )
}

export default Landing;
