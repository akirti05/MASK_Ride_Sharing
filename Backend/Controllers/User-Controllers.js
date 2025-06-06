const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Ride = require("../models/Ride.js");
require("dotenv").config();

const signUp = async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  let existingUser;
   
  try {
    existingUser = await User.findOne({ email });
    if (existingUser !== null) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10); // Increase rounds for stronger hashing
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    await user.save(); // Wait for user to be saved

    console.log("user registered");
    const accesstoken = jwt.sign(
      {
        id: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET
    );
    const id = user._id;
    return res.status(200).json({ accesstoken, id });
  } catch (error) {
    console.log(error); // Log the error for debugging
    return res.status(500).json({ message: "Error signing up user" }); // Respond with an error message
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const user = await User.find({});

    if (user) {
      return res.status(200).json({ user });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const logIn = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (e) {
    console.log(err);
  }
  if (!existingUser) {
    return res.status(404).json({ message: "User is not found" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

  // if (!isPasswordCorrect) {
  //   return res.status(400).json({ message: "Incorrect Password!" });
  // }

  const user = {
    id: existingUser._id,
  };
  const id = existingUser._id;
  const accesstoken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

  return res.status(200).json({ accesstoken, id });
};

const getDetails = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(req.body);
    const user = await User.findById(id);
    if (!user) {
      return res.status(204).json({ message: "no user found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while getting the user details",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId, name, phone, password } = req.body;

    // console.log("inside update", req.body);
    // Find the user by ID
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prepare update data
    const updateData = { name, phone };

    // Update password only if provided
    if (password) {
      // Hash the new password
      const hashedPassword = bcrypt.hashSync(password, 10);
      updateData.password = hashedPassword;
    }

    // Update user information
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true } // Return the updated document
    );

    // Return the updated user
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const recentRides = async (req, res) => {
  try {
    const { id } = req.body;

    // Find the user by ID
    const user = await User.findById(id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has any rides
    if (user.rides.length === 0) {
      return res.status(204).json({ message: "No rides found" });
    }

    // Populate the user's rides
    const populatedRides = await Promise.all(
      user.rides.map((rideId) => Ride.findById(rideId).populate())
    );

    // Return the populated rides
    return res.status(200).json({ rides: populatedRides });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving recent rides",
    });
  }
};

module.exports = {
  signUp,
  getAllUsers,
  logIn,
  getDetails,
  updateUser,
  recentRides,
}; // Export the signUp function
