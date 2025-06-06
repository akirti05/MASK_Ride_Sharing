import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { SignupSchema } from "./Schemas/Driver_schema";

function Signup_sample_Driver() {
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState(null);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      gender: "",
      vehicle_type: "",
      model: "",
      vehicle_number: "",
      phone: "",
    },
    validationSchema: SignupSchema,
    onSubmit: async (values, actions) => {
      try {
        setSignupError(null);
        
        // Format the data for the server
        const signupData = {
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
          gender: values.gender,
          phone: values.phone.trim(),
          vehicle_type: values.vehicle_type.toLowerCase(),
          model: values.model.trim(),
          vehicle_number: values.vehicle_number.trim().toUpperCase(),
          role: "driver"
        };

        console.log("Sending signup data:", signupData);
        
        try {
          const response = await axios.post(
            "http://localhost:3000/driver/signup",
            signupData,
            {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            }
          );

          console.log("Full server response:", response);

          if (response.status === 200 && response.data) {
            console.log("Signup successful, storing data...");
            // Store the tokens and ID
            localStorage.setItem("driver_id", response.data.id);
            localStorage.setItem("accessToken", response.data.accesstoken);
            
            // Clear any existing error
            setSignupError(null);
            
            console.log("Data stored, redirecting...");
            // Force navigation using window.location
            window.location.href = "/driver/dashboard";
            return; // Add return to prevent further execution
          } else {
            throw new Error(response.data?.message || 'Signup failed');
          }
        } catch (error) {
          console.error("Signup error:", error);
          setSignupError(
            error.response?.data?.message || 
            error.message || 
            "Failed to create account. Please try again."
          );
          actions.setSubmitting(false);
        }
      } catch (error) {
        console.error("Detailed signup error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          data: error.config?.data,
          stack: error.stack
        });
        
        if (error.response?.data?.message) {
          setSignupError(error.response.data.message);
        } else if (error.response?.status === 500) {
          setSignupError("Server error occurred. This could be because: \n" +
            "1. The email might already be registered\n" +
            "2. There might be a connection issue with the database\n" +
            "Please try again or contact support if the issue persists.");
        } else if (error.code === 'ECONNABORTED') {
          setSignupError("Request timed out. Please check your internet connection and try again.");
        } else {
          setSignupError("Signup failed. Please check your details and try again. " + error.message);
        }
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  return (
    <div className="signup-form-container">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {signupError && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {signupError}
          </div>
        )}

        <div className="signup-input-wrapper">
          <input
            type="text"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`signup-input ${
              formik.touched.name && formik.errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-sky-200 focus:ring-sky-400"
            }`}
            placeholder="Full Name"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="form-error">{formik.errors.name}</p>
          )}
        </div>

        <div className="signup-input-wrapper">
          <input
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`signup-input ${
              formik.touched.email && formik.errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-sky-200 focus:ring-sky-400"
            }`}
            placeholder="Email Address"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="form-error">{formik.errors.email}</p>
          )}
        </div>

        <div className="signup-input-wrapper">
          <input
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`signup-input ${
              formik.touched.password && formik.errors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-sky-200 focus:ring-sky-400"
            }`}
            placeholder="Password"
            minLength="6"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="form-error">{formik.errors.password}</p>
          )}
        </div>

        <div className="signup-input-wrapper">
          <select
            id="gender"
            name="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`signup-input ${
              formik.touched.gender && formik.errors.gender
                ? "border-red-500 focus:ring-red-500"
                : "border-sky-200 focus:ring-sky-400"
            }`}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {formik.touched.gender && formik.errors.gender && (
            <p className="form-error">{formik.errors.gender}</p>
          )}
        </div>

        <div className="signup-input-wrapper">
          <select
            id="vehicle_type"
            name="vehicle_type"
            value={formik.values.vehicle_type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`signup-input ${
              formik.touched.vehicle_type && formik.errors.vehicle_type
                ? "border-red-500 focus:ring-red-500"
                : "border-sky-200 focus:ring-sky-400"
            }`}
          >
            <option value="">Select Vehicle Type</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
          </select>
          {formik.touched.vehicle_type && formik.errors.vehicle_type && (
            <p className="form-error">{formik.errors.vehicle_type}</p>
          )}
        </div>

        <div className="signup-input-wrapper">
          <input
            type="text"
            id="model"
            name="model"
            value={formik.values.model}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`signup-input ${
              formik.touched.model && formik.errors.model
                ? "border-red-500 focus:ring-red-500"
                : "border-sky-200 focus:ring-sky-400"
            }`}
            placeholder={formik.values.vehicle_type === 'bike' ? "Enter Bike Model" : "Enter Car Model"}
          />
          {formik.touched.model && formik.errors.model && (
            <p className="form-error">{formik.errors.model}</p>
          )}
        </div>

        <div className="signup-input-wrapper">
          <input
            type="text"
            id="vehicle_number"
            name="vehicle_number"
            value={formik.values.vehicle_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`signup-input ${
              formik.touched.vehicle_number && formik.errors.vehicle_number
                ? "border-red-500 focus:ring-red-500"
                : "border-sky-200 focus:ring-sky-400"
            }`}
            placeholder="Vehicle Number"
          />
          {formik.touched.vehicle_number && formik.errors.vehicle_number && (
            <p className="form-error">{formik.errors.vehicle_number}</p>
          )}
        </div>

        <div className="signup-input-wrapper">
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`signup-input ${
              formik.touched.phone && formik.errors.phone
                ? "border-red-500 focus:ring-red-500"
                : "border-sky-200 focus:ring-sky-400"
            }`}
            placeholder="Phone Number"
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="form-error">{formik.errors.phone}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className={`signup-button ${formik.isSubmitting ? "opacity-50" : ""}`}
        >
          {formik.isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}

export default Signup_sample_Driver;
