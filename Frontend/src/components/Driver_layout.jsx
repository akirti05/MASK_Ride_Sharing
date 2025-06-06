import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";



export default function Driver_layout() {


  return (
    <div className="min-h-screen theme-dark bg-skin-fill">
      <main className=" ">
        <Outlet />
      </main>
    </div>
  );
}
