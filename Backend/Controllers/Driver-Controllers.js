const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Driver = require("../models/Driver");
require("dotenv").config();
const signUp = async (req, res, next) => {
  console.log(req.body);
  const { name, email, password, gender, model, phone, vehicle_type, vehicle_number } = req.body;
  let existingUser;

  try {
    existingUser = await Driver.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10); // Increase rounds for stronger hashing
    const driver = new Driver({
      name,
      email,
      password: hashedPassword,
      model,
      phone,
      vehicle_type,
      vehicle_number,
      ...(gender && { gender }), // Only include gender if it's provided
    });

    await driver.save(); // Wait for user to be saved

    console.log("user registered");
    const accesstoken = jwt.sign(
      {
        id: driver._id,
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.status(200).json({ accesstoken, id: driver._id });
  } catch (error) {
    console.log(error); // Log the error for debugging
    return res.status(500).json({ message: "Error signing up user" }); // Respond with an error message
  }
};

const logIn = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  let existingUser;

  try {
    existingUser = await Driver.findOne({ email });
  } catch (e) {
    console.log(err);
  }
  if (!existingUser) {
    return res.status(404).json({ message: "User is not found" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password!" });
  }

  const driver = {
    id: existingUser._id,
  };
  const accesstoken = jwt.sign(driver, process.env.ACCESS_TOKEN_SECRET);

  return res.status(200).json({ accesstoken, id: existingUser._id });
};

const getAllUsers = async (req, res, next) => {
  try {
    const driver = await Driver.find({});

    if (driver) {
      return res.status(200).json({ driver });
    } else {
      return res.status(404).json({ error: "driver not found" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getDetails = async (req, res) => {
  try {
    const { driver_id } = req.body;
    console.log(req.body);
    const driver = await Driver.findById(driver_id);
    if (!driver) {
      return res.status(204).json({ message: "no driver found" });
    }
    console.log(driver);

    return res.status(200).json(driver);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while getting the user details",
    });
  }
};

const updateDriver = async (req, res) => {
  try {
    const { driver_id, name, phone, gender, model, vehicle_type, vehicle_number } = req.body;

    console.log(req.body);
    const updateData = {
      name,
      phone,
      model,
      vehicle_type,
      vehicle_number,
      ...(gender && { gender }), // Only include gender if it's provided
    };

    const updatedDriver = await Driver.findByIdAndUpdate(
      driver_id,
      updateData,
      { new: true }
    );

    if (!updatedDriver) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedDriver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getRides = async (req, res) => {
  const { driver_id } = req.body;
  console.log(req.body);
  try {
    // Find the driver using the provided driver_id
    const driver = await Driver.findById(driver_id).populate("rides");

    if (!driver) {
      return res.status(404).json({ message: "No driver found" });
    }

    // If the driver was found and the rides are populated, return the rides as a JSON response
    return res.status(200).json(driver.rides);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the rides",
    });
  }
};

module.exports = {
  signUp,
  logIn,
  getAllUsers,
  getDetails,
  updateDriver,
  getRides,
};
