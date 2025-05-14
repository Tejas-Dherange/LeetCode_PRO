import React from "react";
import useAuthStore from "../store/useAuthStore";
import Navbar from "../components/Navbar";

function Dashboard() {
  const { logout } = useAuthStore();
  const handleClick = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("error while logout");
    }
  };
  return (
    <div>
        <Navbar/>
      DashBoard
      <button onClick={handleClick}>logout</button>
    </div>
  );
}

export default Dashboard;
