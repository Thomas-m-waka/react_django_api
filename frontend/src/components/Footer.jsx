import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import './Footer.css';
import '@fortawesome/fontawesome-free/css/all.css'

export default function Footer() {
  return (
    <MDBFooter className='text-center text-lg-start text-muted footer-bg'>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom social-section'>
        <div className='me-5 d-none d-lg-block'>
          <span>Get connected with us on social networks:</span>
        </div>
        <div>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="facebook-f" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="twitter" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="google" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="instagram" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="linkedin" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="github" />
          </a>
        </div>
      </section>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>
                <MDBIcon icon="gem" className="me-3" />
                Bowana Spa Center
              </h6>
              <p>
                Experience the best spa services in Nairobi.
              </p>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Products</h6>
              <p>
                <a href='#!' className='text-reset'>
                  Laser Treatment
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Facial Care
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Body Massage
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Skin Care
                </a>
              </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Useful Links</h6>
              <p>
                <a href='/landing' className='text-reset'>
                  Home
                </a>
              </p>
              <p>
                <a href='/booking' className='text-reset'>
                  Book a Visit
                </a>
              </p>
              <p>
                <a href='/services' className='text-reset'>
                  Services
                </a>
              </p>
              <p>
                <a href='/blogs' className='text-reset'>
                  Blogs
                </a>
              </p>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
              <p>
                <MDBIcon icon="home" className="me-2" />
                Nairobi, Kenya
              </p>
              <p>
                <MDBIcon icon="envelope" className="me-3" />
                services@bowana.com
              </p>
              <p>
                <MDBIcon icon="phone" className="me-3" /> + 254 790 291 468
              </p>
              <p>
                <MDBIcon icon="print" className="me-3" /> + 254 790 291 468
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2024:
        <a className='text-reset fw-bold' href='https://mdbootstrap.com/'>
          Bowana.com
        </a>
      </div>
    </MDBFooter>
  );
}
