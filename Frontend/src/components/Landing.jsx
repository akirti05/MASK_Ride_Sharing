import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaUser } from 'react-icons/fa';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">
            Welcome to <span className="text-purple-600">MASK Share</span>
          </h1>
          <p className="hero-subtitle">
            Your reliable ride-sharing platform connecting drivers and passengers
            for safe and comfortable journeys.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/user/login"
              className="button-primary flex items-center"
            >
              <FaUser className="mr-2" />
              Sign Up as User
            </Link>
            <Link
              to="/driver/login"
              className="button-secondary flex items-center"
            >
              <FaCar className="mr-2" />
              Sign Up as Driver
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="heading-1 text-center">Why Choose MASK Share?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="card card-hover">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FaCar className="text-purple-600 text-xl" />
              </div>
              <h3 className="heading-2">Safe Rides</h3>
              <p className="text-body">
                Verified drivers and secure payment options for your peace of mind.
              </p>
            </div>
            <div className="card card-hover">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="heading-2">Quick Pickup</h3>
              <p className="text-body">
                Fast and reliable service with minimal waiting time.
              </p>
            </div>
            <div className="card card-hover">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="heading-2">Secure Payments</h3>
              <p className="text-body">
                Multiple payment options with secure transaction processing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-100 to-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-1">Ready to Start Your Journey?</h2>
          <p className="text-body max-w-2xl mx-auto mb-8">
            Join thousands of satisfied users and drivers who trust MASK Share for their daily commute.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/user/login"
              className="button-primary"
            >
              Get Started as User
            </Link>
            <Link
              to="/driver/login"
              className="button-secondary"
            >
              Become a Driver
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

