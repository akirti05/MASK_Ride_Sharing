import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { FiMapPin, FiCalendar, FiUsers, FiPlus, FiTrash2, FiClock } from "react-icons/fi";
import { BiCar, BiRupee } from "react-icons/bi";

function DriverDashboard() {
  const [rides, setRides] = useState([]);
  const [fromLocation, setFromLocation] = useState("SRM University");
  const [toLocation, setToLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [seats, setSeats] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);

  const locations = {
    university: "SRM University",
    cities: ["Vijayawada", "Tenali", "Guntur", "Mangalagiri"]
  };

  const driverId = localStorage.getItem("driver_id");

  const handleFromLocationChange = (e) => {
    const selectedFrom = e.target.value;
    setFromLocation(selectedFrom);
    
    // If selected location is not university, set to location as university
    if (selectedFrom !== locations.university) {
      setToLocation(locations.university);
    } else {
      setToLocation(""); // Reset to location if from is university
    }
  };

  const handleCreateRide = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Validate inputs
      if (!fromLocation || !toLocation || !date || !time || !seats || !price) {
        throw new Error("Please fill in all fields");
      }

      if (fromLocation === toLocation) {
        throw new Error("From and To locations cannot be the same");
      }

      if (parseInt(seats) < 1) {
        throw new Error("Number of seats must be at least 1");
      }

      if (parseInt(price) < 0) {
        throw new Error("Price cannot be negative");
      }

      // Format date and time properly
      const [hours, minutes] = time.split(':');
      const rideDateTime = new Date(date);
      rideDateTime.setHours(parseInt(hours), parseInt(minutes), 0);

      // Check if the date and time are in the past
      if (rideDateTime < new Date()) {
        throw new Error("Cannot create a ride for a past date and time");
      }

      const rideData = {
        driver: driverId,
        from: {
          country: "India",
          state: "Andhra Pradesh",
          place: fromLocation
        },
        to: {
          country: "India",
          state: "Andhra Pradesh",
          place: toLocation
        },
        date: rideDateTime.toISOString(),
        seats: parseInt(seats),
        cost: parseInt(price),
        available: true
      };

      console.log("Creating ride with data:", rideData);

      const response = await axios.post(
        "http://localhost:3000/ride/create",
        rideData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log("Ride creation response:", response.data);

      if (response.status === 200 || response.status === 201) {
        console.log("Ride created successfully:", response.data);
        setSuccess(true);
        resetForm();
        // Fetch rides immediately after creating a new one
        await fetchRides();
      }
    } catch (err) {
      console.error("Error creating ride:", err);
      
      if (err.response?.status === 404) {
        setError("Failed to create ride. Please try again.");
      } else if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("driver_id");
        window.location.href = "/driver/login";
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to create ride. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFromLocation("SRM University");
    setToLocation("");
    setDate("");
    setTime("");
    setSeats("");
    setPrice("");
  };

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      console.log("Starting dashboard initialization...");
      
      // Check for required authentication data
      const accessToken = localStorage.getItem("accessToken");
      const driverId = localStorage.getItem("driver_id");

      console.log("Auth data check:", {
        hasAccessToken: !!accessToken,
        hasDriverId: !!driverId,
        driverId: driverId
      });

      if (!accessToken || !driverId) {
        console.log("Missing authentication data, redirecting to login");
        window.location.href = "/driver/login";
        return;
      }

      try {
        // Fetch rides directly without separate validation
        setLoading(true);
        console.log("Fetching rides for driver:", driverId);
        
        const ridesResponse = await axios.get(
          `http://localhost:3000/ride/driver/${driverId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            },
          }
        );

        console.log("Rides fetched successfully:", ridesResponse.data);
        
        if (Array.isArray(ridesResponse.data)) {
          // Filter out past rides and sort by date
          const now = new Date();
          const upcomingRides = ridesResponse.data.filter(ride => {
            const rideDate = new Date(ride.date);
            return rideDate >= now;
          }).sort((a, b) => new Date(a.date) - new Date(b.date));
          
          setRides(upcomingRides);
          setError(""); // Clear any existing errors
        } else {
          console.error("Invalid rides data format:", ridesResponse.data);
          setError("Failed to load rides data");
        }
      } catch (err) {
        console.error("Dashboard initialization error:", {
          error: err,
          response: err.response?.data,
          status: err.response?.status
        });

        if (err.response?.status === 401) {
          console.log("Authentication failed, clearing tokens and redirecting...");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("driver_id");
          window.location.href = "/driver/login";
          return;
        }

        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, []);

  const fetchRides = async () => {
    try {
      console.log("Fetching rides for driver:", driverId);
      setLoading(true);
      setError(null);

      if (!driverId) {
        throw new Error("Driver ID not found");
      }

      const response = await axios.get(
        `http://localhost:3000/ride/driver/${driverId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          },
        }
      );

      console.log("Rides fetch response:", response.data);

      if (Array.isArray(response.data)) {
        // Filter out past rides and sort by date
        const now = new Date();
        const upcomingRides = response.data.filter(ride => {
          const rideDate = new Date(ride.date);
          return rideDate >= now;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        console.log("Filtered upcoming rides:", upcomingRides);
        setRides(upcomingRides);
        setError(""); // Clear any existing errors
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching rides:", {
        error: err,
        response: err.response?.data,
        status: err.response?.status
      });
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("driver_id");
        window.location.href = "/driver/login";
      } else {
        setError("Failed to fetch rides. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRide = async (rideId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        "http://localhost:3000/ride/delete",
        {
          ride_id: rideId,
          driver_id: driverId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 200) {
        fetchRides();
      }
    } catch (err) {
      setError("Failed to delete ride. Please try again.");
      console.error("Error deleting ride:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatIndianPrice = (price) => {
    const number = parseInt(price);
    if (isNaN(number)) return "0";
    
    const formatted = number.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
      useGrouping: true
    });
    
    return formatted;
  };

  const formatLocation = (location) => {
    if (typeof location === 'string') {
      return location;
    }
    
    if (location && typeof location === 'object' && location.place) {
      return location.place;
    }
    
    return "Location not specified";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <Sidebar />
      <div className="p-6 sm:p-10 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Create Ride Form */}
          <div className="lg:w-1/3">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BiCar className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Create Ride</h2>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
                  Ride created successfully!
                </div>
              )}

              <form onSubmit={handleCreateRide} className="space-y-4">
                {/* From Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="w-4 h-4" />
                      From Location
                    </div>
                  </label>
                  <select
                    value={fromLocation}
                    onChange={handleFromLocationChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 focus:bg-white transition-colors duration-200"
                    required
                  >
                    <option value={locations.university}>{locations.university}</option>
                    {locations.cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* To Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="w-4 h-4" />
                      To Location
                    </div>
                  </label>
                  {fromLocation === locations.university ? (
                    <select
                      value={toLocation}
                      onChange={(e) => setToLocation(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 focus:bg-white transition-colors duration-200"
                      required
                    >
                      <option value="">Select destination</option>
                      {locations.cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={locations.university}
                      className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 cursor-not-allowed text-gray-500"
                      disabled
                    />
                  )}
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="w-4 h-4" />
                        Date
                      </div>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 focus:bg-white transition-colors duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center gap-2">
                        <FiClock className="w-4 h-4" />
                        Time
                      </div>
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 focus:bg-white transition-colors duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center gap-2">
                        <FiUsers className="w-4 h-4" />
                        Seats
                      </div>
                    </label>
                    <input
                      type="number"
                      value={seats}
                      onChange={(e) => setSeats(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 focus:bg-white transition-colors duration-200"
                      required
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center gap-2">
                        <BiRupee className="w-4 h-4" />
                        Price per seat
                      </div>
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 focus:bg-white transition-colors duration-200"
                      required
                      min="0"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FiPlus className="w-5 h-5" />
                      Create Ride
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Rides List */}
          <div className="lg:flex-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Your Rides</h2>
                <div className="text-sm text-gray-500">
                  {rides.length} {rides.length === 1 ? 'ride' : 'rides'} created
                </div>
              </div>

              {loading && rides.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-12">{error}</div>
              ) : rides.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  No rides created yet
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {rides.map((ride) => (
                    <div
                      key={ride._id}
                      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <FiCalendar className="w-4 h-4 text-purple-600" />
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

                          <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center gap-1">
                              <FiMapPin className="w-4 h-4 text-purple-600" />
                              <div className="w-0.5 h-6 bg-gray-200"></div>
                              <FiMapPin className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-gray-800">
                                <div className="font-medium">
                                  {formatLocation(ride.from)}
                                </div>
                              </div>
                              <div className="text-gray-800 mt-4">
                                <div className="font-medium">
                                  {formatLocation(ride.to)}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <FiUsers className="w-4 h-4" />
                              <span>{ride.seats} seats available</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BiRupee className="w-4 h-4" />
                              <span>₹{ride.cost} per seat</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteRide(ride._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Current Passengers</h3>
                {currentRide?.passengers?.map((passenger, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{passenger.name}</p>
                        <p className="text-sm text-gray-500">Gender: {passenger.gender}</p>
                        <p className="text-sm text-gray-500">Phone: {passenger.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Seats: {passenger.seats}</p>
                        <p className="text-sm text-gray-500">Status: {passenger.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;
