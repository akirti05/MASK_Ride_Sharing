import React, { useEffect, useState } from "react";
import Sidebar_User from "./Sidebar_User";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMapPin, FiCalendar, FiUsers, FiTruck } from "react-icons/fi";
import { BiRupee } from "react-icons/bi";

function Payment() {
  const [rideDetails, setRideDetails] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showRideDetails, setShowRideDetails] = useState(false);

  const navigate = useNavigate();
  const { rideId } = useParams();

  console.log("Payment component mounted with rideId:", rideId);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if user is logged in
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.log("No access token found");
          setError("Please login to continue");
          navigate("/user/login");
          return;
        }

        console.log("Fetching ride details for ID:", rideId);
        const response = await axios.get(`http://localhost:3000/ride/${rideId}`, {
          headers: {
            Authorization: `bearer ${token}`
          },
        });

        console.log("Ride details response:", response.data);
        
        if (response.status === 200 && response.data) {
          setRideDetails(response.data);
        } else {
          console.log("Invalid response:", response);
          setError("Failed to load ride details. Please try again.");
        }
      } catch (err) {
        console.error("Error fetching ride details:", err);
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          navigate("/user/login");
        } else {
          setError(err.response?.data?.message || "Failed to load ride details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (rideId) {
      console.log("Initiating ride details fetch for ID:", rideId);
      fetchRideDetails();
    } else {
      console.log("No rideId provided");
      setError("Invalid ride ID");
    }
  }, [rideId, navigate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      setBookingLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("id");

      if (!token || !userId) {
        setError("Please login to continue");
        navigate("/user/login");
        return;
      }

      console.log("Booking ride with details:", {
        ride_id: rideId,
        user_id: userId,
        seats: selectedSeats
      });

      const response = await axios.post(
        "http://localhost:3000/ride/update",
        {
          ride_id: rideId,
          user_id: userId,
          seats: selectedSeats,
        },
        {
          headers: {
            Authorization: `bearer ${token}`
          },
        }
      );

      console.log("Booking response:", response.data);

      if (response.status === 200 || response.status === 201) {
        setBookingSuccess(true);
      }
    } catch (err) {
      console.error("Error booking ride:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        navigate("/user/login");
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || "Invalid booking request. Please check seat availability.");
      } else if (err.response?.status === 404) {
        setError("Ride not found or no longer available.");
      } else {
        setError(err.response?.data?.message || "Failed to book ride. Please try again.");
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatLocation = (location) => {
    if (typeof location === 'string') {
      return location;
    }
    
    if (location && typeof location === 'object') {
      return location.place || "Location not specified";
    }
    
    return "Location not specified";
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <Sidebar_User />
        <div className="p-6 sm:p-10 max-w-xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">Your ride has been successfully booked.</p>
            
            <div className="flex flex-col gap-3">
              {showRideDetails ? (
                <>
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3">
                      <FiCalendar className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-gray-800">
                        {formatDate(rideDetails.date)}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1">
                        <FiMapPin className="w-5 h-5 text-purple-600" />
                        <div className="w-0.5 h-6 bg-gray-200"></div>
                        <FiMapPin className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-gray-800">
                          <div className="font-medium">From</div>
                          <div className="text-gray-600">{formatLocation(rideDetails.from)}</div>
                        </div>
                        <div className="text-gray-800 mt-4">
                          <div className="font-medium">To</div>
                          <div className="text-gray-600">{formatLocation(rideDetails.to)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Driver and Vehicle Details */}
                    {rideDetails.driver && (
                      <div className="space-y-3 border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <FiTruck className="w-5 h-5 text-purple-600" />
                          <div className="flex flex-col gap-2 w-full">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-gray-600">
                                <span className="font-medium">Driver: </span>
                                <span>{rideDetails.driver.name}</span>
                              </div>
                              <div className="text-gray-600">
                                <span className="font-medium">Contact: </span>
                                <span>{rideDetails.driver.phoneNumber}</span>
                              </div>
                              <div className="text-gray-600">
                                <span className="font-medium">Email: </span>
                                <span>{rideDetails.driver.email}</span>
                              </div>
                              <div className="text-gray-600">
                                <span className="font-medium">Gender: </span>
                                <span>{rideDetails.driver.gender}</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-gray-600">
                                <span className="font-medium">Vehicle: </span>
                                <span>{rideDetails.driver.vehicleType}</span>
                              </div>
                              <div className="text-gray-600">
                                <span className="font-medium">Model: </span>
                                <span>{rideDetails.driver.vehicleModel}</span>
                              </div>
                              <div className="text-gray-600">
                                <span className="font-medium">Number: </span>
                                <span>{rideDetails.driver.vehicleNumber}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-gray-600 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2">
                        <FiUsers className="w-5 h-5 text-purple-600" />
                        <span>{selectedSeats} seat(s) booked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BiRupee className="w-5 h-5 text-purple-600" />
                        <span>{rideDetails.cost * selectedSeats} total amount</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/user/recent")}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                  >
                    Done
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowRideDetails(true)}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                  >
                    View Ride Details
                  </button>
                  <button
                    onClick={() => navigate("/user/recent")}
                    className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    Okay
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <Sidebar_User />
        <div className="p-6 sm:p-10 max-w-xl mx-auto">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
          <button
            onClick={() => navigate("/user/dashboard")}
            className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!rideDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <Sidebar_User />
        <div className="p-6 sm:p-10 max-w-xl mx-auto">
          <div className="text-center text-gray-600">
            No ride details available
          </div>
          <button
            onClick={() => navigate("/user/dashboard")}
            className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <Sidebar_User />
      <div className="p-6 sm:p-10 max-w-xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Book Your Ride</h2>

          <div className="space-y-6">
            {/* Ride Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FiCalendar className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-800">
                  {formatDate(rideDetails.date)}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1">
                  <FiMapPin className="w-5 h-5 text-purple-600" />
                  <div className="w-0.5 h-6 bg-gray-200"></div>
                  <FiMapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-gray-800">
                    <div className="font-medium">From</div>
                    <div className="text-gray-600">{formatLocation(rideDetails.from)}</div>
                  </div>
                  <div className="text-gray-800 mt-4">
                    <div className="font-medium">To</div>
                    <div className="text-gray-600">{formatLocation(rideDetails.to)}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center gap-2">
                  <FiUsers className="w-5 h-5 text-purple-600" />
                  <span>{rideDetails.seats} seats available</span>
                </div>
                <div className="flex items-center gap-2">
                  <BiRupee className="w-5 h-5 text-purple-600" />
                  <span>{rideDetails.cost} per seat</span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Seats
                </label>
                <select
                  value={selectedSeats}
                  onChange={(e) => setSelectedSeats(Number(e.target.value))}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                >
                  {[...Array(Math.min(rideDetails.seats, 5))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Total Amount:</span>
                  <div className="flex items-center text-xl font-semibold text-gray-800">
                    <BiRupee className="w-6 h-6" />
                    <span>{rideDetails.cost * selectedSeats}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {bookingLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
