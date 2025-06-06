import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { FiUser, FiMail, FiPhone, FiSave } from "react-icons/fi";
import { BiCar } from "react-icons/bi";

function DriverEditProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    vehicle_type: "",
    model: "",
    vehicle_number: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchDriverData();
  }, []);

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        "http://localhost:3000/driver/details",
        {
          driver_id: localStorage.getItem("driver_id"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 200) {
        setFormData(response.data);
      }
    } catch (err) {
      setError("Failed to fetch driver details. Please try again.");
      console.error("Error fetching driver data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await axios.post(
        "http://localhost:3000/driver/update",
        {
          driver_id: localStorage.getItem("driver_id"),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender,
          vehicle_type: formData.vehicle_type,
          model: formData.model,
          vehicle_number: formData.vehicle_number
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        await fetchDriverData();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating driver:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <Sidebar />
      <div className="p-6 sm:p-10 max-w-3xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Edit Profile</h1>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                <BiCar className="w-12 h-12 text-purple-600" />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full text-2xl font-semibold text-gray-800 bg-transparent border-b border-gray-300 focus:border-purple-500 focus:ring-0 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Name
                  </div>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    Email
                  </div>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <FiPhone className="w-4 h-4" />
                    Phone Number
                  </div>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Gender
                  </div>
                </label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <BiCar className="w-4 h-4" />
                    Vehicle Type
                  </div>
                </label>
                <input
                  type="text"
                  name="vehicle_type"
                  value={formData.vehicle_type || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <BiCar className="w-4 h-4" />
                    Vehicle Model
                  </div>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <BiCar className="w-4 h-4" />
                    Vehicle Number
                  </div>
                </label>
                <input
                  type="text"
                  name="vehicle_number"
                  value={formData.vehicle_number || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FiSave className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DriverEditProfile;
