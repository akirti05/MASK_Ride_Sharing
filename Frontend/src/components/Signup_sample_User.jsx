import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { SignupSchema } from "./Schemas";

function SignupSampleUser() {
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
    validationSchema: SignupSchema,
    onSubmit: async (values, actions) => {
      try {
        console.log("Attempting signup with:", { email: values.email, name: values.name });
        
        const response = await axios.post(
          "http://localhost:3000/user/signup",
          values
        );

        console.log("Signup response:", response.data);

        if (!response.data || !response.data.accesstoken) {
          console.error("Invalid response format:", response.data);
          setError("Signup failed. Please try again.");
          return;
        }

        // Store token and ID
        localStorage.setItem("accessToken", response.data.accesstoken);
        localStorage.setItem("id", response.data.id);

        // Clear any existing error
        setError(null);

        // Navigate to dashboard
        navigate("/user/dashboard");
      } catch (err) {
        console.error("Signup error:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        if (err.response?.status === 409) {
          setError("Email already exists. Please use a different email.");
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Signup failed. Please try again.");
        }
      } finally {
        actions.resetForm();
      }
    },
  });

  // Rendering form
  return (
    <div className="signup-form-container">
      <h1 className="text-3xl pb-2 font-bold text-center tracking-wide text-black">
        Sign Up
      </h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
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
          />
          {formik.touched.password && formik.errors.password && (
            <p className="form-error">{formik.errors.password}</p>
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

        {error && (
          <div className="text-sm text-red-600 text-center animate-fade-in">
            {error}
          </div>
        )}

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

export default SignupSampleUser;
