import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { FiUser, FiMail, FiPhone, FiCalendar } from "react-icons/fi";
import { BiCar } from "react-icons/bi";

function DriverProfile() {
  const [driverDetails, setDriverDetails] = useState({});
  const [memberSince, setMemberSince] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDriverDetails();
  }, []);

  const fetchDriverDetails = async () => {
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
        setDriverDetails(response.data);
        
        // Set member since year from registration date
        if (response.data.createdAt || response.data.registrationDate) {
          const date = new Date(response.data.createdAt || response.data.registrationDate);
          setMemberSince(date.getFullYear());
        }
      }
    } catch (err) {
      setError("Failed to fetch driver details. Please try again.");
      console.error("Error fetching driver details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !driverDetails.name) {
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
            <h1 className="text-3xl font-bold text-gray-800">Driver Profile</h1>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {/* Profile Header */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                <BiCar className="w-12 h-12 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {driverDetails.name || "Driver"}
                </h2>
                <div className="flex items-center gap-2 text-gray-500 mt-1">
                  <FiCalendar className="w-4 h-4" />
                  <span>Member since {memberSince}</span>
                </div>
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
                <p className="text-gray-800">{driverDetails.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Gender
                  </div>
                </label>
                <p className="text-gray-800">{driverDetails.gender}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    Email
                  </div>
                </label>
                <p className="text-gray-800">{driverDetails.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <FiPhone className="w-4 h-4" />
                    Phone Number
                  </div>
                </label>
                <p className="text-gray-800">{driverDetails.phone}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <BiCar className="w-4 h-4" />
                    Vehicle Type
                  </div>
                </label>
                <p className="text-gray-800 capitalize">{driverDetails.vehicle_type}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <BiCar className="w-4 h-4" />
                    Vehicle Model
                  </div>
                </label>
                <p className="text-gray-800">{driverDetails.model}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <BiCar className="w-4 h-4" />
                    Vehicle Number
                  </div>
                </label>
                <p className="text-gray-800">{driverDetails.vehicle_number}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverProfile;
