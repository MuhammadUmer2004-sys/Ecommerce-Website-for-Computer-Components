import React, { useState } from "react";
import "./../components-css/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="contact-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="fade-in">Contact Us</h1>
          <p className="lead fade-in-delay">Get in touch with our team</p>
          <div className="hero-separator"></div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-4">
            <div className="contact-info-cards">
              <div className="contact-card fade-in">
                <i className="fas fa-map-marker-alt"></i>
                <h3>Visit Us</h3>
                <p>
                  Shop #409, Abdullah Haroon Road,
                  <br />
                  Saddar, Karachi, Pakistan
                </p>
              </div>
              <div className="contact-card fade-in-delay">
                <i className="fas fa-phone"></i>
                <h3>Call Us</h3>
                <p>
                  +92 (345) 120-870
                  <br />
                  Monday - Saturday, 10AM to 6PM
                </p>
              </div>
              <div className="contact-card fade-in-delay-2">
                <i className="fas fa-envelope"></i>
                <h3>Email Us</h3>
                <p>
                  info@wishtech.com
                  <br />
                  support@wishtech.com
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="contact-form-container fade-in-up">
              <h2>Send us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group floating-label">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                  <label>Your Name</label>
                </div>

                <div className="form-group floating-label">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                  <label>Your Email</label>
                </div>

                <div className="form-group floating-label">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                  <label>Subject</label>
                </div>

                <div className="form-group floating-label">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="form-control"
                    rows="5"
                  ></textarea>
                  <label>Your Message</label>
                </div>

                <button type="submit" className="btn btn-primary submit-btn">
                  Send Message
                  <i className="fas fa-paper-plane ml-2"></i>
                </button>
              </form>

              {submitted && (
                <div className="alert alert-success mt-3" role="alert">
                  Thank you for your message. We'll get back to you soon!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="map-container mt-5 fade-in-up">
          <h2>Find Us</h2>
          <div className="google-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.7740257540145!2d67.02772661500801!3d24.8603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDUxJzM3LjEiTiA2N8KwMDEnNTAuMCJF!5e0!3m2!1sen!2s!4v1625641211111!5m2!1sen!2s"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
