const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  country: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  place: {
    type: String,
    required: true
  }
}, { _id: false });

const RideSchema = new Schema({
  from: {
    type: LocationSchema,
    required: true
  },
  to: {
    type: LocationSchema,
    required: true
  },
  date: {
    type: Date,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
    required: true,
  },
  driver: {
    type: mongoose.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  users: [{
    type: mongoose.Types.ObjectId,
    ref: "User"
  }]
});

module.exports = mongoose.model("Ride", RideSchema);
