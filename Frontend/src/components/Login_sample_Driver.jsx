import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { LoginSchema } from "./Schemas";

function Login_sample_Driver() {
  const navigate = useNavigate();
  const [error_, setError] = useState();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, actions) => {
      try {
        console.log("Attempting login with:", values.email);
        const response = await axios.post("http://localhost:3000/driver/login", {
          email: values.email,
          password: values.password,
        });

        console.log("Login response:", response.data);
        const accessToken = response.data.accesstoken;
        const driverId = response.data.id;
        
        if (!accessToken || !driverId) {
          throw new Error("Invalid response from server - missing token or ID");
        }

        console.log("Storing tokens - Access Token:", accessToken.substring(0, 10) + "...", "Driver ID:", driverId);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("driver_id", driverId);
        
        console.log("Validating stored data...");
        const storedToken = localStorage.getItem("accessToken");
        const storedId = localStorage.getItem("driver_id");
        
        if (!storedToken || !storedId) {
          throw new Error("Failed to store authentication data");
        }

        console.log("Data stored successfully, navigating to dashboard...");
        navigate("/driver/dashboard");
      } catch (error) {
        console.error("Login error:", error);
        setError(true);
        if (error.response?.data?.message) {
          console.error("Server error message:", error.response.data.message);
        }
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  return (
    <div className="signup-form-container">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
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
          />
          {formik.touched.password && formik.errors.password && (
            <p className="form-error">{formik.errors.password}</p>
          )}
        </div>

        {error_ && (
          <p className="form-error text-center">
            Invalid email or password. Please try again.
          </p>
        )}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className={`signup-button ${formik.isSubmitting ? "opacity-50" : ""}`}
        >
          Sign In
        </button>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="form-checkbox" />
            <span className="ml-2 text-sm text-slate-600">Remember me</span>
          </label>
          <a href="#" className="text-sm text-sky-600 hover:underline">
            Forgot password?
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login_sample_Driver;
