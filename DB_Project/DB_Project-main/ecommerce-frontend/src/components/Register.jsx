import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../components-css/Register.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log(API_BASE_URL);

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords don't match!");
      return;
    }

    const requestBody = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      role: "customer",
      password: formData.password,
    };

    try {
      const response = await axiosInstance.post(
        `/api/auth/register`,
        requestBody
      );

      if (response.status === 201) {
        setSuccessMessage("Registration successful!");
        setErrorMessage("");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          error.response.data.message || "An error occurred while registering."
        );
        setSuccessMessage("");
      } else if (error.request) {
        setErrorMessage("Failed to communicate with the backend.");
        setSuccessMessage("");
      } else {
        setErrorMessage("An unexpected error occurred.");
        setSuccessMessage("");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <div className="register-form">
          <div className="form-header">
            <h2>Create Account</h2>
            <p className="subtitle">Join our community today</p>
          </div>

          {/* Display error message */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {/* Display success message */}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <div className="input-group">
                  <i className="fas fa-user input-icon"></i>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="First Name"
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-group">
                  <i className="fas fa-user input-icon"></i>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Last Name"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="input-group">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email Address"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-group">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Password"
                />
                <i
                  className={`fas ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  } password-toggle`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
            </div>

            <div className="form-group">
              <div className="input-group">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            <button type="submit" className="register-btn">
              <span>Register</span>
              <i className="fas fa-user-plus"></i>
            </button>

            <div className="login-link">
              <p>
                Already have an account? <Link to="/login">Login here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
