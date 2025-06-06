import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

function Login_sample_User() {
  const navigate = useNavigate();
  const [error_, setError_] = React.useState(false);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Must be at least 6 characters")
        .required("Required"),
    }),

    onSubmit: async (values) => {
      try {
        console.log("Attempting login with:", { email: values.email });
        
        const res = await axios.post("http://localhost:3000/user/login", {
          email: values.email,
          password: values.password,
        });

        console.log("Login response:", res.data);

        if (!res.data || !res.data.accesstoken) {
          console.error("Invalid response format:", res.data);
          setError_("Login failed. Please try again.");
          return;
        }

        // Store token and ID
        localStorage.setItem("accessToken", res.data.accesstoken);
        localStorage.setItem("id", res.data.id);

        // Clear any existing error
        setError_(false);

        // Navigate to dashboard
        navigate("/user/dashboard");
      } catch (err) {
        console.error("Login error:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        if (err.response?.status === 401) {
          setError_("Invalid email or password");
        } else if (err.response?.data?.message) {
          setError_(err.response.data.message);
        } else {
          setError_("Login failed. Please try again.");
        }
      }
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="form-group">
        <label htmlFor="email" className="block text-sm font-medium text-purple-700 mb-1">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaEnvelope className="h-5 w-5 text-purple-400" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2.5 pl-10 rounded-lg 
              bg-white border border-purple-200
              text-purple-900 
              placeholder:text-purple-400
              focus:ring-2 focus:ring-purple-400 focus:border-transparent
              transition-all duration-200
              shadow-sm hover:shadow-md
              ${errors.email && touched.email
                ? "border-red-500 focus:ring-red-500"
                : touched.email
                ? "border-green-500 focus:ring-green-500"
                : ""}`}
            placeholder="Enter your email"
          />
        </div>
        {errors.email && touched.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="block text-sm font-medium text-purple-700 mb-1">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="h-5 w-5 text-purple-400" />
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2.5 pl-10 rounded-lg 
              bg-white border border-purple-200
              text-purple-900 
              placeholder:text-purple-400
              focus:ring-2 focus:ring-purple-400 focus:border-transparent
              transition-all duration-200
              shadow-sm hover:shadow-md
              ${errors.password && touched.password
                ? "border-red-500 focus:ring-red-500"
                : touched.password
                ? "border-green-500 focus:ring-green-500"
                : ""}`}
            placeholder="Enter your password"
          />
        </div>
        {errors.password && touched.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      {error_ && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error_}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-skin-button-accent border-gray-300 rounded focus:ring-skin-button-accent"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-skin-base-2">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="text-skin-button-accent hover:underline">
            Forgot your password?
          </a>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg 
          hover:bg-purple-700 transition-all duration-200 
          font-medium focus:ring-2 focus:ring-offset-2 focus:ring-purple-300
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-md hover:shadow-lg"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

export default Login_sample_User;
