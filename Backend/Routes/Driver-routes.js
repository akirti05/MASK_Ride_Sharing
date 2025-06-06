const express = require("express");
const {
  signUp,
  logIn,
  getDetails,
  updateDriver,
  getRides,
} = require("../Controllers/Driver-Controllers");
const { authenticate } = require("../Middlewares/User-middleware");
const { getAllUsers } = require("../Controllers/Driver-Controllers");

const driverRouter = express.Router();

driverRouter.post("/signup", signUp);
driverRouter.post("/login", logIn);
driverRouter.get("/all", authenticate, getAllUsers);
driverRouter.post("/details", authenticate, getDetails);
driverRouter.post("/update", authenticate, updateDriver);
driverRouter.post("/rides", authenticate, getRides);

module.exports = driverRouter;
