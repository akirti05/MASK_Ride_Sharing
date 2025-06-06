import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaEdit,
  FaClock,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";

const Sidebar_User = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      path: "/user/dashboard",
      name: "Dashboard",
      icon: <FaHome className="w-5 h-5" />,
    },
    {
      path: "/user/profile",
      name: "Profile",
      icon: <FaUser className="w-5 h-5" />,
    },
    {
      path: "/user/edit",
      name: "Edit Profile",
      icon: <FaEdit className="w-5 h-5" />,
    },
    {
      path: "/user/recent",
      name: "My Bookings",
      icon: <FaClock className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("id");
    window.location.href = "/user/login";
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-purple-900 text-white hover:bg-purple-800 transition-colors"
      >
        {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-64 h-full bg-purple-900 text-white shadow-lg">
          {/* Logo */}
          <div className="p-6 border-b border-purple-800">
            <h1 className="text-2xl font-bold text-white">MASK Share</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto pt-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "bg-purple-700 text-white"
                    : "text-purple-100 hover:bg-purple-800"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Profile Section */}
          <div className="p-4 border-t border-purple-800">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center">
                <FaUser className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {localStorage.getItem("name") || "User"}
                </p>
                <p className="text-xs text-purple-300">
                  {localStorage.getItem("email") || "user@example.com"}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-purple-100 hover:bg-purple-800 rounded-lg transition-colors duration-200"
              >
                <FaSignOutAlt className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar_User;
