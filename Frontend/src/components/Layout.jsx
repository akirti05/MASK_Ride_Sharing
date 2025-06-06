import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

import Header from "./Header";

export default function Layout() {
  useEffect(() => {
    // Check for token in local storage or wherever you store it
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login page if no token
      // navigate("/login");
    }
  }, []); // No dependencies

  return (
    <div className="min-h-screen flex flex-col">
      <main className=" ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
