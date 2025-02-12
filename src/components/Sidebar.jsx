import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={{
      width: "250px",
      background: "#333",
      color: "white",
      padding: "20px",
      height: "100vh"
    }}>
      <h2>Dashboard</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/dashboard/" style={{ color: "white" }}>Home</Link></li>
        <li><Link to="/dashboard/profile" style={{ color: "white" }}>Profile</Link></li>
        <li><Link to="/dashboard/settings" style={{ color: "white" }}>Settings</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;  // ✅ Ensure this is default export
