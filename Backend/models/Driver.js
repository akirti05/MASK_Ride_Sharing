const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DriverSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  model: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  vehicle_type: {
    type: String,
    required: true,
  },
  vehicle_number: {
    type: String,
    required: true,
  },
  rides: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Ride",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Driver", DriverSchema);
