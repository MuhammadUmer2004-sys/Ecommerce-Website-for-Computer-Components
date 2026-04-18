import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const adminAuthService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/login`, {
        email,
        password,
      });
      return response.data; // Includes token or OTP required flag
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Invalid email or password"
      );
    }
  },

  verifyOTP: async (email, otp) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/verify-otp`,
        { email, otp }
      );
      localStorage.setItem("adminToken", response.data.token); // Store token
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Invalid OTP");
    }
  },
};
