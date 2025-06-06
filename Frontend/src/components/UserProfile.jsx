import React, { useEffect, useState } from "react";
import Sidebar_User from "./Sidebar_User";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaCalendar } from "react-icons/fa";

function UserProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRides, setTotalRides] = useState(0);
  const [memberSince, setMemberSince] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("accessToken");
        const id = localStorage.getItem("id");
        
        if (!token || !id) {
          setError("Please login to view your profile");
          return;
        }

        // Fetch user details
        const userRes = await axios.post(
          "http://localhost:3000/user/details",
          { id },
          {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }
        );

        if (!userRes.data) {
          setError("Failed to load user details");
          return;
        }

        setName(userRes.data.name || "");
        setPhone(userRes.data.phone || "");
        setEmail(userRes.data.email || "");
        
        // Get registration date from user details
        const registrationDate = userRes.data.createdAt || userRes.data.registrationDate;
        if (registrationDate) {
          const regDate = new Date(registrationDate);
          setMemberSince(regDate.getFullYear().toString());
        } else {
          // If no date is available, use current date
          const currentDate = new Date();
          setMemberSince(currentDate.getFullYear().toString());
        }

        // Fetch recent rides to get total count
        const ridesRes = await axios.post(
          "http://localhost:3000/user/recent",
          { id },
          {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }
        );

        if (ridesRes.data && ridesRes.data.rides) {
          setTotalRides(ridesRes.data.rides.length);
        }

      } catch (err) {
        console.error("Error fetching user details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to load profile details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <Sidebar_User />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <Sidebar_User />
        <div className="flex justify-center items-center h-screen">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <Sidebar_User />
      <div className="p-6 sm:p-10 max-w-3xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
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
                <FaUser className="w-12 h-12 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {name || "User"}
                </h2>
                <div className="flex items-center gap-2 text-gray-500 mt-1">
                  <FaCalendar className="w-4 h-4" />
                  <span>Member since {memberSince}</span>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <FaUser className="w-4 h-4" />
                    Name
                  </div>
                </label>
                <p className="text-gray-800">{name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="w-4 h-4" />
                    Email
                  </div>
                </label>
                <p className="text-gray-800">{email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  <div className="flex items-center gap-2">
                    <FaPhone className="w-4 h-4" />
                    Phone Number
                  </div>
                </label>
                <p className="text-gray-800">{phone}</p>
              </div>
            </div>

            {/* Account Summary */}
            <div className="bg-purple-50 rounded-xl p-6 flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-800">{memberSince}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Rides</span>
                  <span className="font-medium text-gray-800">{totalRides}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
