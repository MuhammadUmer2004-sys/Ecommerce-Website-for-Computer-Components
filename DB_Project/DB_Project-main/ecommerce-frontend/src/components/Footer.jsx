import React from "react";
import "./../components-css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white pt-4">
      <div className="container">
        <div className="row justify-content-between mt-5">
          <div className="col-md-3">
            <h5>Wish Tech</h5>
            <p>
              We are a leading e-commerce platform providing a wide range of
              products to cater to all your needs.
            </p>
          </div>
          <div className="col-md-3 text-md-center">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/products" className="text-white">
                  Products
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Follow Us</h5>
            <ul className="list-unstyled">
              <li>
                <a href="https://facebook.com" className="text-white">
                  <i className="fab fa-facebook-f"></i> Facebook
                </a>
              </li>
              <li>
                <a href="https://twitter.com" className="text-white">
                  <i className="fab fa-twitter"></i> Twitter
                </a>
              </li>
              <li>
                <a href="https://instagram.com" className="text-white">
                  <i className="fab fa-instagram"></i> Instagram
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" className="text-white">
                  <i className="fab fa-linkedin"></i> LinkedIn
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Contact Us</h5>
            <ul className="list-unstyled">
              <li>
                <i className="fas fa-map-marker-alt"></i> Shop #409, Abdullah
                Haroon Road, Saddar, Karachi, Pakistan
              </li>
              <li>
                <i className="fas fa-phone"></i> +92 (345) 120-870
              </li>
              <li>
                <i className="fas fa-envelope"></i> info@wishtech.com
              </li>
            </ul>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col text-center">
            <p>
              &copy; {new Date().getFullYear()} Wish Tech. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
