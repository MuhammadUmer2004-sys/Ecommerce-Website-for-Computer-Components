import React from "react";
import "./../components-css/About.css";
import aboutImage from "../images/fab6e97a2249b08babe35d2f655540ce.jpg";

const About = () => {
  return (
    <div className="about-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="fade-in">About Wish Tech</h1>
          <p className="lead fade-in-delay">
            Your Trusted Partner in Technology
          </p>
          <div className="hero-separator"></div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row align-items-center fade-in-up">
          <div className="col-md-6 d-flex justify-content-center px-4">
            <img
              src={aboutImage}
              alt="About Wish Tech"
              className="about-image img-fluid rounded shadow"
            />
          </div>
          <div className="col-md-6">
            <h2 className="section-title">Our Story</h2>
            <div className="title-underline"></div>
            <p className="mt-4">
              Founded in 2024, Wish Tech has emerged as a leading provider of
              premium computer hardware and technology solutions. Our journey
              began with a simple mission: to make high-quality technology
              accessible to everyone.
            </p>
            <p>We pride ourselves on offering:</p>
            <ul className="feature-list">
              <li>
                <i className="fas fa-check-circle"></i> Premium Quality Products
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Expert Technical Support
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Competitive Pricing
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Fast & Reliable Shipping
              </li>
            </ul>
          </div>
        </div>

        <div className="stats-section mt-5 py-5 fade-in-up">
          <div className="row text-center">
            <div className="col-md-3">
              <div className="stat-item">
                <i className="fas fa-users"></i>
                <h3>1000+</h3>
                <p>Happy Customers</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item">
                <i className="fas fa-shopping-cart"></i>
                <h3>5000+</h3>
                <p>Products Delivered</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item">
                <i className="fas fa-star"></i>
                <h3>4.8/5</h3>
                <p>Customer Rating</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item">
                <i className="fas fa-globe"></i>
                <h3>24/7</h3>
                <p>Support Available</p>
              </div>
            </div>
          </div>
        </div>

        <div className="values-section mt-5 fade-in-up">
          <h2 className="section-title text-center">Our Values</h2>
          <div className="title-underline mx-auto"></div>
          <div className="row mt-5">
            <div className="col-md-4">
              <div className="value-card">
                <i className="fas fa-heart"></i>
                <h3>Customer First</h3>
                <p>
                  Your satisfaction is our top priority. We strive to exceed
                  your expectations.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="value-card">
                <i className="fas fa-shield-alt"></i>
                <h3>Quality Assured</h3>
                <p>
                  We guarantee the authenticity and quality of every product we
                  sell.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="value-card">
                <i className="fas fa-sync"></i>
                <h3>Innovation</h3>
                <p>
                  Constantly evolving to bring you the latest in technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
