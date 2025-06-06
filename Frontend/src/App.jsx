import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Landing from "./components/Landing";
import User_layout from "./components/User_layout";
import Driver_layout from "./components/Driver_layout";
import UserDashboard from "./components/UserDashboard";
import DriverDashboard from "./components/DriverDashboard";
import DriverProfile from "./components/DriverProfile";
import UserProfile from "./components/UserProfile";
import UserEditProfile from "./components/UserEditProfile";
import DriverEditProfile from "./components/DriverEditProfile";
import UserRides from "./components/UserRides";
import Payment from "./components/Payment";
import DriverRides from "./components/DriverRides";
import Login_Signup_Driver from "./components/Login_Signup_Driver";
import Login_Signup_User from "./components/Login_Signup_User";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Main landing page */}
          <Route index element={<Landing />} />

          {/* User layout section */}
          <Route path="user" element={<User_layout />}>
            <Route path="login" element={<Login_Signup_User />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="edit" element={<UserEditProfile />} />
            <Route path="recent" element={<UserRides />} />
            <Route path="payment/:rideId" element={<Payment />} />
          </Route>

          {/* Driver layout section */}
          <Route path="driver" element={<Driver_layout />}>
            <Route path="login" element={<Login_Signup_Driver />} />
            <Route path="dashboard" element={<DriverDashboard />} />
            <Route path="profile" element={<DriverProfile />} />
            <Route path="edit" element={<DriverEditProfile />} />
            <Route path="recent" element={<DriverRides />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
