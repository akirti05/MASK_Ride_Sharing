import React, { useEffect, useState } from "react";
import { FaCarSide } from "react-icons/fa";
import Signup_sample_Driver from "./Signup_sample_Driver";
import Login_sample_Driver from "./Login_sample_Driver";

function Login_Signup_Driver() {
  const [signed, setSigned] = useState("signup");
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const hasReloaded = localStorage.getItem("login");
    localStorage.removeItem("profiles");
    if (!hasReloaded) {
      localStorage.setItem("login", "true");
      window.location.reload();
    }
    localStorage.removeItem("cachedData");
    localStorage.removeItem("savedLink");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-3 rounded-full bg-purple-100 mb-4">
            <FaCarSide className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-purple-900 mb-4">Welcome to MASK Share</h1>
          <p className="text-lg text-purple-700 max-w-2xl mx-auto">
            Join our community of drivers and start earning today
          </p>
        </div>

        {/* Auth Card */}
        <div className="max-w-md mx-auto animate-slide-up">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            {/* Tab Navigation */}
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => setSigned("signup")}
                className={`flex items-center px-6 py-2 rounded-lg transition-all duration-200 ${
                  signed === "signup"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-purple-700 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                <span className="mr-2">Sign Up</span>
              </button>
              <button
                onClick={() => setSigned("login")}
                className={`flex items-center px-6 py-2 rounded-lg transition-all duration-200 ${
                  signed === "login"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-purple-700 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                <span className="mr-2">Login</span>
              </button>
            </div>

            {/* Auth Form */}
            <div className="transition-all duration-300">
              {signed === "signup" ? <Signup_sample_Driver /> : <Login_sample_Driver />}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center animate-fade-in">
            <p className="text-purple-700">
              By signing up, you agree to our{" "}
              <a href="#" className="text-purple-600 hover:underline font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-600 hover:underline font-medium">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login_Signup_Driver;
