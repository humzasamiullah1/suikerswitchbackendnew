import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // ✅ Ensure this is correct
import Home from "./Home";
import Profile from "./Profile";
import Settings from "./Settings";

function Dashboard() {
  return (
    <div className="flex lg:flex-row flex-col w-full">
      <div className="lg:w-[20%]">
        <Sidebar />
      </div>
      <div className="lg:w-[80%]">
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
