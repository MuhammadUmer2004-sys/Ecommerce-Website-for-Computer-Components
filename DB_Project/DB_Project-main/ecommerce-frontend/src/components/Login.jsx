import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import "../components-css/Login.css";
import { useAuth } from "./../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoggedIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const requestBody = {
      email: email,
      password: password,
    };

    try {
      const response = await axiosInstance.post(`/api/auth/login`, requestBody);

      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data;

        localStorage.setItem("accessToken", accessToken);

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        setSuccessMessage("Login successful!");
        setTimeout(() => setSuccessMessage(""), 5000);

        console.log("Login response data:", response.data);

        setIsLoggedIn(true);
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          error.response.data.message || "An error occurred while logging in"
        );
        console.error("Login failed:", error.response.data);
      } else if (error.request) {
        setErrorMessage("Failed to communicate with the backend.");
        console.error("No response from server:", error.request);
      } else {
        setErrorMessage("An unexpected error occurred.");
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <div className="login-form">
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p className="subtitle">Log in to your account</p>
          </div>

          {/* Displaying error message if any */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {/* Displaying success message if login is successful */}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <div className="input-group">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-group">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="form-footer">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="forgot-password">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="login-btn">
              <span>Login</span>
              <i className="fas fa-arrow-right"></i>
            </button>

            <div className="register-link">
              <p>
                Don't have an account? <Link to="/register">Register here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
