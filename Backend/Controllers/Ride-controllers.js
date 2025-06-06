const Driver = require("../models/Driver");
const Ride = require("../models/Ride");
const User = require("../models/User");

const createRide = async (req, res) => {
  try {
    const { driver, from, to, date, seats, cost } = req.body;
    console.log("Received ride data:", req.body);

    const driverDoc = await Driver.findById(driver);
    if (!driverDoc) {
      return res.status(404).json({ error: "Driver not found" });
    }

    const _date = new Date(date);
    const newRide = new Ride({
      from,
      to,
      date: _date,
      seats,
      cost,
      available: true,
      driver: driverDoc._id,
      users: []
    });

    console.log("Creating new ride:", newRide);

    const savedRide = await newRide.save();
    console.log("Ride saved:", savedRide);

    // Add ride to driver's rides array
    driverDoc.rides.push(savedRide._id);
    await driverDoc.save();
    console.log("Driver updated with new ride");

    res.status(201).json(savedRide);
  } catch (err) {
    console.error("Error creating ride:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};
// const deleteRide = async (req, res) => {
//   try {
//     const { id } = req.body;

//     try {
//       const result = await Ride.findByIdAndDelete(id);
//       if (!result) {
//         return res
//           .status(404)
//           .json({ success: false, message: "Ride not found" });
//       }
//     } catch (err) {
//       return res.status(404).json({ error: "ride doesn't exist" });
//     }

//     return res
//       .status(200)
//       .json({ success: true, message: "Ride deleted successfully" });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while deleting the Ride",
//     });
//   }
// };

const deleteRide = async (req, res) => {
  try {
    // Extract the ride ID from the request body
    const { id } = req.body;

    // Find the ride by its ID
    const ride = await Ride.findById(id);
    if (!ride) {
      // If the ride is not found, return a 404 error
      return res
        .status(404)
        .json({ success: false, message: "Ride not found" });
    }

    // Find the associated driver using the ride's driver reference
    const driver = await Driver.findById(ride.driver);
    if (driver) {
      // Remove the ride ID from the driver's rides array
      driver.rides.pull(ride._id);
      // Save the updated driver document
      await driver.save();
    }

    // Delete the ride
    await Ride.findByIdAndDelete(id);

    // Respond with a success message
    return res
      .status(200)
      .json({ success: true, message: "Ride deleted successfully" });
  } catch (err) {
    // Handle any errors
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the ride",
    });
  }
};

const getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find();
    if (!rides) {
      return res.status(204).json({ message: "no rides found" });
    }
    return res.status(200).json(rides);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while getting all the Ride",
    });
  }
};
const UpdateRide = async (req, res) => {
  try {
    const { ride_id, user_id, seats } = req.body;

    // Validate seats to be a positive integer
    if (!seats || seats <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid number of seats requested" });
    }

    // Find the ride and user
    const ride = await Ride.findById(ride_id);
    const user = await User.findById(user_id);

    // Check if ride and user exist
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has already booked this ride
    if (ride.users.includes(user_id)) {
      return res.status(400).json({ message: "You have already booked this ride" });
    }

    // Check if there are enough seats available
    if (ride.seats < seats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Add the user ID to the ride's users list with booked seats
    ride.users.push(user_id);
    ride.userSeats = ride.userSeats || {};
    ride.userSeats[user_id] = seats;

    // Update the available seats in the ride
    ride.seats -= seats;

    // If no seats left, mark ride as unavailable
    if (ride.seats === 0) {
      ride.available = false;
    }

    // Save the ride
    await ride.save();

    // Add the ride ID to the user's rides list if not already present
    if (!user.rides.includes(ride_id)) {
      user.rides.push(ride_id);
      await user.save();
    }

    // Get the populated ride details for response
    const populatedRide = await Ride.findById(ride_id)
      .populate('driver', 'name vehicle_type model phone vehicle_number email');

    return res.status(200).json({ 
      message: "Booking confirmed successfully",
      ride: {
        _id: populatedRide._id,
        from: populatedRide.from,
        to: populatedRide.to,
        date: populatedRide.date,
        bookedSeats: seats,
        cost: populatedRide.cost,
        driver: {
          name: populatedRide.driver.name,
          vehicleType: populatedRide.driver.vehicle_type,
          vehicleModel: populatedRide.driver.model,
          phoneNumber: populatedRide.driver.phone,
          email: populatedRide.driver.email,
          vehicleNumber: populatedRide.driver.vehicle_number
        }
      }
    });
  } catch (err) {
    console.error("Error updating ride:", err);
    return res.status(500).json({ 
      message: err.message || "An error occurred while booking the ride" 
    });
  }
};

module.exports = { createRide, deleteRide, getAllRides, UpdateRide };
