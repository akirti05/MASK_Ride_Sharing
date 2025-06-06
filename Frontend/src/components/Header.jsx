import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">M</span>
                </div>
                <span className="ml-2 text-xl font-bold text-purple-600">MASK Share</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/user/login"
              className="text-purple-600 hover:text-purple-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              User Login
            </Link>
            <Link
              to="/driver/login"
              className="text-purple-600 hover:text-purple-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Driver Login
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
