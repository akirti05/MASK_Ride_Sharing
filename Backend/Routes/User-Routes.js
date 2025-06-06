const express = require("express");
const userRouter = express.Router();
const {
  signUp,
  getAllUsers,
  logIn,
  getDetails,
  updateUser,
  recentRides,
} = require("../Controllers/User-Controllers");
const { authenticate } = require("../Middlewares/User-middleware");

userRouter.post("/signup", signUp);
userRouter.get("/all", authenticate, getAllUsers);
userRouter.post("/details", authenticate, getDetails);
userRouter.post("/login", logIn);
userRouter.post("/update", authenticate, updateUser);
userRouter.post("/recent", recentRides);

module.exports = userRouter;
