import React from 'react';
import './Services.css';
import Navbar from './Navbar';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import serviceImage1 from '../assets/cupping.jpg'
import serviceImage2 from '../assets/hotstone.jpg'
import serviceImage3 from '../assets/prenatal.jpg'

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1
  }
};

const ServicesComponent = (props) => {
  const images = [
    { src: serviceImage1, alt: 'Service 1' },
    { src: serviceImage2, alt: 'Service 2' },
    { src: serviceImage3, alt: 'Service 3' },
    { src: serviceImage1, alt: 'Service 4' },
    { src: serviceImage2, alt: 'Service 5' },
    { src: serviceImage3, alt: 'Service 6' }
  ];

  return (
    <div>
      <Navbar />
      <div className="tailbloc-container" style={{ backgroundColor: '#D5D6B6' }}>
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="text-center mb-20">
              <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900 mb-4">
                Our Services
              </h1>
              <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-500">
                Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy.
                Gastropub indxgo juice poutine, ramps microdosing banh mi pug.
              </p>
              <div className="flex mt-6 justify-center">
                <div className="w-16 h-1 rounded-full bg-indigo-500 inline-flex"></div>
              </div>
            </div>

            <div className="carousel-wrapper" style={{ marginBottom: '40px' }}>
              <Carousel
                swipeable={true}
                draggable={false}
                showDots={true}
                responsive={responsive}
                ssr={true} // means to render carousel on server-side.
                infinite={true}
                //autoPlay={true}
                autoPlay={props.deviceType !== "mobile"}
                autoPlaySpeed={1000}
                keyBoardControl={true}
                customTransition="all .5"
                transitionDuration={1000}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["desktop","tablet", "mobile"]}
                deviceType={props.deviceType}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-5-px"
              >
                {images.map((image, index) => (
                  <div key={index}>
                    <img src={image.src} alt={image.alt} className="carousel-image" />
                  </div>
                ))}
              </Carousel>
            </div>

            <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
              <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
                <div className="w-20 h-20 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5 flex-shrink-0">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <div className="flex-grow">
                  <h2 className="text-gray-900 text-lg title-font font-medium mb-3">Derma Care</h2>
                  <p className="leading-relaxed text-base">
                    Our array of rejuvenating facials, meticulously designed to address your skin's individual
                    requirements and enhance its natural beauty. Explore a spectrum of advanced treatments designed
                    to elevate your skincare routine, providing not just temporary fixes but lasting, transformative
                    results. Experience the perfect fusion of science and luxury as we cater to your skin's every
                    desire, leaving you with a radiant glow that speaks volumes.
                  </p>
                  <a href="/booking" className="mt-3 text-indigo-500 inline-flex items-center">
                    Explore Our Facials
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 ml-2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
                <div className="w-20 h-20 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5 flex-shrink-0">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="6" cy="6" r="3"></circle>
                    <circle cx="6" cy="18" r="3"></circle>
                    <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
                  </svg>
                </div>
                <div className="flex-grow">
                  <h2 className="text-gray-900 text-lg title-font font-medium mb-3">Hair Removal Services</h2>
                  <p className="leading-relaxed text-base">
                    Unveil the path to effortless beauty with our range of hair removal solutions. Whether you seek the
                    instant gratification of traditional waxing or the enduring sleekness of advanced laser treatments,
                    we provide bespoke services tailored to your desires. Experience the evolution of smoothness as our
                    expert technicians guide you through a seamless journey towards hair-free confidence. With us,
                    discover a sanctuary where every preference finds its perfect match, and where smooth, radiant skin
                    becomes your signature.
                  </p>
                  <a href="/blogs" className="mt-3 text-indigo-500 inline-flex items-center">
                    Explore Hair Removal Services
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 ml-2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
                <div className="w-20 h-20 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5 flex-shrink-0">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="flex-grow">
                  <h2 className="text-gray-900 text-lg title-font font-medium mb-3">Relax, Heal, Balance</h2>
                  <p className="leading-relaxed text-base">
                    Dive into a realm of profound rejuvenation with our diverse range of massage therapies. Whether you
                    crave the gentle touch of Swedish relaxation or the revitalizing power of deep tissue, each session
                    is a tailored experience designed to harmonize your body, mind, and spirit. Experience the art of
                    healing hands as our skilled therapists guide you towards profound relaxation and holistic balance
                    where every touch is a step towards renewed vitality and inner peace.
                  </p>
                  <a href="/booking" className="mt-3 text-indigo-500 inline-flex items-center">
                    Explore Massages
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 ml-2"
                      viewBox="0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServicesComponent;