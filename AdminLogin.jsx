import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";
import "./../../components-css/AdminLogin.css";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpState, setIsOtpState] = useState(false);
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (
        credentials.email === "admin@wishtech.com" &&
        credentials.password === "admin123"
      ) {
        setIsOtpState(true);
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (otp === "123456") {
        await adminLogin();
        navigate("/admin/dashboard");
      } else {
        setError("Invalid OTP");
      }
    } catch (error) {
      setError("OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-header">
        <h1>Admin Portal</h1>
        <h2>Sign In</h2>
      </div>
      <div className="admin-form-container">
        <div className="admin-form">
          {error && <div className="admin-error">{error}</div>}

          {!isOtpState ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="admin-form-group">
                <input
                  type="email"
                  className="admin-input"
                  placeholder="Email"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="admin-form-group">
                <input
                  type="password"
                  className="admin-input"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="admin-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <div className="admin-form-group">
                <label htmlFor="otp-input">Enter OTP sent to your email:</label>
                <input
                  type="text"
                  id="otp-input"
                  className="admin-input otp-input"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                className="admin-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
