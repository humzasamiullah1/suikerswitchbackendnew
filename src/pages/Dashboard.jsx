import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // ✅ Ensure this is correct
import Home from "./Home";
import Product from "./Product"
import Blogs from "./Blogs"

function Dashboard() {
  return (
    <div className="flex lg:flex-row flex-col w-full">
      <div className="lg:w-[20%]">
        <Sidebar />
      </div>
      <div className="lg:w-[80%] overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/blogs" element={<Blogs />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
