const express = require("express");
const { authenticate } = require("../Middlewares/User-middleware");
const {
  createRide,
  deleteRide,
  getAllRides,
  UpdateRide,
} = require("../Controllers/Ride-controllers");
const Ride = require("../models/Ride");

const rideRouter = express.Router();

// Create a new ride
rideRouter.post("/create", authenticate, createRide);

// Delete a ride
rideRouter.post("/delete", authenticate, deleteRide);

// Get all rides with driver details
rideRouter.get("/all", authenticate, async (req, res) => {
  try {
    const rides = await Ride.find()
      .populate('driver', 'name vehicle_type model phone vehicle_number gender')
      .sort({ date: 1 });
    
    if (!rides || rides.length === 0) {
      return res.status(204).json({ message: "No rides found" });
    }

    // Transform the data to include formatted date and driver details
    const formattedRides = rides.map(ride => ({
      _id: ride._id,
      from: ride.from,
      to: ride.to,
      date: ride.date,
      seats: ride.seats,
      cost: ride.cost,
      available: ride.available,
      driver: {
        name: ride.driver.name,
        vehicleType: ride.driver.vehicle_type,
        vehicleModel: ride.driver.model,
        phoneNumber: ride.driver.phone,
        vehicleNumber: ride.driver.vehicle_number,
        gender: ride.driver.gender
      }
    }));

    return res.status(200).json(formattedRides);
  } catch (err) {
    console.error("Error fetching rides:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while getting all the rides"
    });
  }
});

// Get rides for a specific driver
rideRouter.get("/driver/:driverId", authenticate, async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.params.driverId })
      .populate('driver', 'name vehicle_type model phone vehicle_number gender')
      .sort({ date: 1 });
    
    // Transform the data to match the format
    const formattedRides = rides.map(ride => ({
      ...ride.toObject(),
      driver: {
        name: ride.driver.name,
        vehicleType: ride.driver.vehicle_type,
        vehicleModel: ride.driver.model,
        phoneNumber: ride.driver.phone,
        vehicleNumber: ride.driver.vehicle_number,
        gender: ride.driver.gender
      }
    }));
    
    res.json(formattedRides);
  } catch (err) {
    console.error("Error fetching driver rides:", err);
    res.status(500).json({ error: "Failed to fetch rides" });
  }
});

// Get a single ride by ID
rideRouter.get("/:rideId", authenticate, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId)
      .populate('driver', 'name vehicle_type model phone vehicle_number email gender');
    
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Transform the data to match the format
    const formattedRide = {
      _id: ride._id,
      from: ride.from,
      to: ride.to,
      date: ride.date,
      seats: ride.seats,
      cost: ride.cost,
      available: ride.available,
      driver: {
        name: ride.driver.name,
        vehicleType: ride.driver.vehicle_type,
        vehicleModel: ride.driver.model,
        phoneNumber: ride.driver.phone,
        email: ride.driver.email,
        vehicleNumber: ride.driver.vehicle_number,
        gender: ride.driver.gender
      }
    };

    return res.status(200).json(formattedRide);
  } catch (err) {
    console.error("Error fetching ride:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while getting the ride details"
    });
  }
});

// Get rides for a specific user
rideRouter.get("/user/:userId", authenticate, async (req, res) => {
  try {
    const rides = await Ride.find({ users: req.params.userId })
      .populate('driver', 'name vehicle_type model phone vehicle_number email')
      .sort({ date: 1 });
    
    // Transform the data to match the format
    const formattedRides = rides.map(ride => ({
      _id: ride._id,
      from: ride.from,
      to: ride.to,
      date: ride.date,
      seats: ride.seats,
      cost: ride.cost,
      available: ride.available,
      bookedSeats: 1, // You might want to store this in the ride document
      driver: {
        name: ride.driver.name,
        vehicleType: ride.driver.vehicle_type,
        vehicleModel: ride.driver.model,
        phoneNumber: ride.driver.phone,
        email: ride.driver.email,
        vehicleNumber: ride.driver.vehicle_number
      }
    }));
    
    return res.status(200).json(formattedRides);
  } catch (err) {
    console.error("Error fetching user rides:", err);
    return res.status(500).json({ 
      success: false,
      message: "Failed to fetch rides" 
    });
  }
});

// Update a ride (add user to ride)
rideRouter.post("/update", authenticate, UpdateRide);

module.exports = rideRouter;
