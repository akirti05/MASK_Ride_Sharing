const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


const userRouter = require("./Routes/User-Routes");
const { authenticate } = require("./Middlewares/User-middleware");
const driverRouter = require("./Routes/Driver-routes");
const rideRouter = require("./Routes/Ride-routes");
require("./config");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/driver", driverRouter);
app.use("/ride", rideRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", authenticate, (req, res) => res.send("hello world"));
