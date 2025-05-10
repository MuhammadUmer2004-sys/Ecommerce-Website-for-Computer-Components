import React, { useState, useEffect } from "react";
import "./../components-css/Checkout.css";
import {
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import ReactConfetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Shipping", "Payment", "Review"];
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    paymentMethod: "card",
  });

  const [errors, setErrors] = useState({});

  const FORM_FIELDS = {
    firstName: {
      label: "First Name",
      type: "text",
      required: true,
      validate: (value) => (!value ? "First name is required" : null),
    },
    lastName: {
      label: "Last Name",
      type: "text",
      required: true,
      validate: (value) => (!value ? "Last name is required" : null),
    },
    email: {
      label: "Email",
      type: "email",
      required: true,
      validate: (value) => {
        if (!value) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
        return null;
      },
    },
    address: {
      label: "Address",
      type: "text",
      required: true,
      validate: (value) => (!value ? "Address is required" : null),
    },
    city: {
      label: "City",
      type: "text",
      required: true,
      validate: (value) => (!value ? "City is required" : null),
    },
    state: {
      label: "State",
      type: "text",
      required: true,
      validate: (value) => (!value ? "State is required" : null),
    },
    zipCode: {
      label: "ZIP Code",
      type: "text",
      required: true,
      validate: (value) => (!value ? "ZIP code is required" : null),
    },
    cardNumber: {
      label: "Card Number",
      placeholder: "1234 5678 9012 3456",
      type: "text",
      required: true,
      validate: (value) => (!value ? "Card number is required" : null),
    },
    expiryDate: {
      label: "Expiry Date",
      placeholder: "MM/YY",
      type: "text",
      required: true,
      validate: (value) => (!value ? "Expiry date is required" : null),
    },
    cvv: {
      label: "CVV",
      placeholder: "123",
      type: "text",
      required: true,
      validate: (value) => (!value ? "CVV is required" : null),
    },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(FORM_FIELDS).forEach((field) => {
      const error = FORM_FIELDS[field].validate(formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
      return;
    }

    if (activeStep === 0) {
      const shippingFields = [
        "firstName",
        "lastName",
        "email",
        "address",
        "city",
        "state",
        "zipCode",
      ];
      const isValid = shippingFields.every((field) => formData[field]?.trim());
      if (!isValid) {
        validateForm();
        return;
      }
    }

    if (activeStep === 1) {
      if (formData.paymentMethod === "card") {
        const paymentFields = ["cardNumber", "expiryDate", "cvv"];
        const isValid = paymentFields.every((field) => formData[field]?.trim());
        if (!isValid) {
          validateForm();
          return;
        }
      }
    }

    setActiveStep((prev) => prev + 1);
  };

  const handlePlaceOrder = () => {
    setOrderSuccess(true);
    setShowConfetti(true);
    clearCart();
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  const handlePaymentMethodChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: event.target.value,
    }));
  };

  const SuccessOverlay = () => (
    <div className="success-overlay">
      {showConfetti && <ReactConfetti />}
      <div className="success-content">
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <h2>Order Placed Successfully!</h2>
        <p>You will receive a confirmation email shortly.</p>
        <div className="email-icon">
          <i className="fas fa-envelope"></i>
        </div>
      </div>
    </div>
  );

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-main">
          <Stepper activeStep={activeStep} className="checkout-stepper">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <div className="checkout-form">
            {activeStep === 0 && (
              <div className="shipping-form">
                <h2>Shipping Information</h2>
                <div className="form-grid">
                  {Object.keys(FORM_FIELDS)
                    .slice(0, 7)
                    .map((fieldName) => (
                      <TextField
                        key={fieldName}
                        {...FORM_FIELDS[fieldName]}
                        name={fieldName}
                        value={formData[fieldName]}
                        onChange={handleInputChange}
                        error={!!errors[fieldName]}
                        helperText={errors[fieldName]}
                      />
                    ))}
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="payment-section">
                <h2>Payment Method</h2>
                <RadioGroup
                  value={formData.paymentMethod}
                  onChange={handlePaymentMethodChange}
                >
                  <div className="payment-option">
                    <FormControlLabel
                      value="card"
                      control={<Radio />}
                      label="Credit/Debit Card"
                    />
                    <div className="payment-details">
                      {Object.keys(FORM_FIELDS)
                        .slice(7, 10)
                        .map((fieldName) => (
                          <TextField
                            key={fieldName}
                            {...FORM_FIELDS[fieldName]}
                            name={fieldName}
                            value={formData[fieldName]}
                            onChange={handleInputChange}
                            error={!!errors[fieldName]}
                            helperText={errors[fieldName]}
                          />
                        ))}
                    </div>
                  </div>
                  <FormControlLabel
                    value="cod"
                    control={<Radio />}
                    label="Cash on Delivery"
                  />
                </RadioGroup>
              </div>
            )}

            {activeStep === 2 && (
              <div className="review-section">
                <h2>Review Order</h2>
                <div className="review-details">
                  <div className="review-item">
                    <h3>Shipping Address</h3>
                    <p>
                      {formData.firstName} {formData.lastName}
                    </p>
                    <p>{formData.address}</p>
                    <p>
                      {formData.city}, {formData.state} {formData.zipCode}
                    </p>
                    <p>{formData.email}</p>
                  </div>
                  <div className="review-item">
                    <h3>Payment Method</h3>
                    <p>
                      {formData.paymentMethod === "card"
                        ? `Credit Card ending in ${formData.cardNumber.slice(
                            -4
                          )}`
                        : "Cash on Delivery"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form-buttons">
            {activeStep > 0 && (
              <button
                className="back-btn"
                onClick={() => setActiveStep((prev) => prev - 1)}
              >
                Back
              </button>
            )}
            <button className="next-btn" onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Place Order" : "Continue"}
            </button>
          </div>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            <div className="summary-item">
              <span>Subtotal</span>
              <span>Rs. 744,900</span>
            </div>
            <div className="summary-item">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>Rs. 744,900</span>
            </div>
          </div>
        </div>
      </div>
      {orderSuccess && <SuccessOverlay />}
    </div>
  );
};

export default Checkout;
