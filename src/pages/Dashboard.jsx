import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // ✅ Ensure this is correct
import Home from "./Home";
import Profile from "./Profile";
import Settings from "./Settings";

function Dashboard() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
