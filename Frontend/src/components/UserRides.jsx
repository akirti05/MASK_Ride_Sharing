import React, { useEffect, useState } from "react";
import Sidebar_User from "./Sidebar_User";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCalendar, FiUsers, FiTruck } from "react-icons/fi";
import { BiRupee } from "react-icons/bi";

function UserRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("id");

        if (!token || !userId) {
          setError("Please login to continue");
          navigate("/user/login");
          return;
        }

        const response = await axios.get(`http://localhost:3000/ride/user/${userId}`, {
          headers: {
            Authorization: `bearer ${token}`
          }
        });

        if (response.status === 200) {
          // Sort rides by date
          const sortedRides = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
          setRides(sortedRides);
        }
      } catch (err) {
        console.error("Error fetching rides:", err);
        setError(err.response?.data?.message || "Failed to load rides");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLocation = (location) => {
    if (typeof location === 'string') {
      return location;
    }
    return location?.place || "Location not specified";
  };

  const filterRides = (type) => {
    const now = new Date();
    if (type === "upcoming") {
      return rides.filter(ride => new Date(ride.date) >= now);
    } else {
      return rides.filter(ride => new Date(ride.date) < now);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <Sidebar_User />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <Sidebar_User />
      <div className="p-6 sm:p-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Bookings</h2>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === "upcoming"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 hover:bg-purple-50"
              }`}
            >
              Upcoming Rides
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === "past"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 hover:bg-purple-50"
              }`}
            >
              Past Rides
            </button>
          </div>

          {error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="space-y-4">
              {filterRides(activeTab).map((ride) => (
                <div
                  key={ride._id}
                  className="bg-white/70 backdrop-blur-sm rounded-lg shadow-md p-6"
                >
                  <div className="space-y-4">
                    {/* Date */}
                    <div className="flex items-center gap-3">
                      <FiCalendar className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-gray-800">
                        {formatDate(ride.date)}
                      </span>
                    </div>

                    {/* Locations */}
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1">
                        <FiMapPin className="w-5 h-5 text-purple-600" />
                        <div className="w-0.5 h-8 bg-gray-200"></div>
                        <FiMapPin className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="space-y-4">
                        <div className="text-gray-800">
                          <div className="font-medium">From</div>
                          <div className="text-gray-600">{formatLocation(ride.from)}</div>
                        </div>
                        <div className="text-gray-800">
                          <div className="font-medium">To</div>
                          <div className="text-gray-600">{formatLocation(ride.to)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle and Driver Details */}
                    {ride.driver && (
                      <div className="flex items-center gap-2">
                        <FiTruck className="w-5 h-5 text-purple-600" />
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-gray-600">
                            <span className="font-medium">Vehicle: </span>
                            <span>{ride.driver.vehicleType}</span>
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">Model: </span>
                            <span>{ride.driver.vehicleModel}</span>
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">Number: </span>
                            <span>{ride.driver.vehicleNumber}</span>
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">Gender: </span>
                            <span>{ride.driver.gender}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Price and Seats */}
                    <div className="flex items-center justify-between text-gray-600 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2">
                        <FiUsers className="w-5 h-5 text-purple-600" />
                        <span>{ride.bookedSeats || 1} seat(s) booked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BiRupee className="w-5 h-5 text-purple-600" />
                        <span>{ride.cost * (ride.bookedSeats || 1)} total amount</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filterRides(activeTab).length === 0 && (
                <div className="text-center text-gray-600 py-8">
                  No {activeTab} rides found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserRides;
