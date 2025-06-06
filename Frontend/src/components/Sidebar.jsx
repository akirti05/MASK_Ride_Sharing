import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaTimes, FaBars, FaUser, FaHome, FaHistory, FaSignOutAlt, FaCar, FaEdit } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("driver_id");
    navigate("/");
  };

  const menuItems = [
    { path: "/driver/dashboard", name: "Dashboard", icon: <FaHome className="w-5 h-5" /> },
    { path: "/driver/profile", name: "Profile", icon: <FaUser className="w-5 h-5" /> },
    { path: "/driver/edit", name: "Edit Profile", icon: <FaEdit className="w-5 h-5" /> },
    { path: "/driver/recent", name: "Recent Rides", icon: <FaHistory className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-purple-900 text-white hover:bg-purple-800 transition-colors"
      >
        {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-64 h-full bg-purple-900 text-white shadow-lg">
          <div className="flex items-center justify-between p-4 border-b border-purple-800">
            <div className="flex items-center space-x-2">
              <FaCar className="w-6 h-6 text-purple-300" />
              <span className="text-xl font-semibold">MASK Share</span>
            </div>
          </div>

          <div className="p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path
                      ? "bg-purple-800 text-white"
                      : "text-purple-200 hover:bg-purple-800 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-800">
            <button
              onClick={logout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-purple-200 hover:bg-purple-800 hover:text-white rounded-lg transition-colors duration-200"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
