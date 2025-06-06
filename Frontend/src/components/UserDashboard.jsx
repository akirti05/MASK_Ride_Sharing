import React, { useEffect, useState } from "react";
import img1 from "../../public/img1.jpeg";
import axios from "axios";
import Sidebar_User from "./Sidebar_User";
import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiTruck } from "react-icons/fi";
import { BiRupee } from "react-icons/bi";

function UserDashboard() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchTime, setSearchTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Please login to view available rides");
        setLoading(false);
        return;
      }

      console.log("Fetching rides with token:", token);
      
      const res = await axios.get("http://localhost:3000/ride/all", {
        headers: {
          Authorization: `bearer ${token}`
        },
      });
      
      console.log("API Response:", res.data);
      
      if (!res.data) {
        setError("No rides available");
        return;
      }

      const availableRides = Array.isArray(res.data) ? res.data.filter(ride => ride.seats > 0) : [];
      console.log("Available rides:", availableRides);
      
      setData(availableRides);
      setFilteredData(availableRides);
    } catch (err) {
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to load rides. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      if (!searchDate) {
        setError("Please select a date");
        return;
      }

      // Create a Date object from the search date and time
      const searchDateTime = new Date(searchDate);
      if (searchTime) {
        const [hours, minutes] = searchTime.split(':');
        searchDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
      } else {
        // If no time selected, set to start of day
        searchDateTime.setHours(0, 0, 0, 0);
      }

      console.log("Filtering rides for datetime:", searchDateTime);

      // Filter rides based on date and time
      const filtered = data.filter(ride => {
        const rideDateTime = new Date(ride.date);
        return rideDateTime >= searchDateTime;
      });

      // Sort rides by date/time
      const sortedRides = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

      console.log("Filtered rides:", sortedRides);
      setFilteredData(sortedRides);

      if (sortedRides.length === 0) {
        setError("No rides available for the selected date and time");
      }
    } catch (err) {
      console.error("Error filtering rides:", err);
      setError("Failed to filter rides. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <Sidebar_User />
      <div className="p-6 sm:p-10 max-w-6xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Available Rides</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    Date
                  </div>
                </label>
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4" />
                    Time (Optional)
                  </div>
                </label>
                <input
                  type="time"
                  value={searchTime}
                  onChange={(e) => setSearchTime(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
              >
                Search Rides
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchDate("");
                  setSearchTime("");
                  setFilteredData(data);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Rides</h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              No rides available for the selected criteria
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData.map((ride) => (
                <div
                  key={ride._id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-4">
                      {/* Date and Time */}
                      <div className="flex items-center gap-3">
                        <FiCalendar className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-gray-800">
                          {new Date(ride.date).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {/* From and To Locations with Details */}
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center gap-1">
                              <FiMapPin className="w-5 h-5 text-purple-600" />
                              <div className="w-0.5 h-8 bg-gray-200"></div>
                              <FiMapPin className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="space-y-4">
                              <div className="text-gray-800">
                                <div className="font-medium">
                                  From: {typeof ride.from === 'string' ? ride.from : ride.from.place}
                                </div>
                              </div>
                              <div className="text-gray-800">
                                <div className="font-medium">
                                  To: {typeof ride.to === 'string' ? ride.to : ride.to.place}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="flex flex-col gap-4 items-start">
                              <div className="flex items-center gap-2 text-gray-700">
                                <FiUsers className="w-5 h-5 text-purple-600" />
                                <span>{ride.seats} seats available</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <BiRupee className="w-5 h-5 text-purple-600" />
                                <span>{ride.cost} per seat</span>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <Link
                                to={`/user/payment/${ride._id}`}
                                className="px-6 py-3 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium whitespace-nowrap"
                              >
                                Book Now
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* Vehicle Details Row */}
                        <div className="flex items-center gap-2">
                          {ride.driver && (
                            <div className="flex items-center gap-2">
                              <FiTruck className="w-5 h-5 text-purple-600" />
                              <div className="flex gap-4">
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
