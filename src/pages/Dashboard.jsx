import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; // ✅ Ensure this is correct
import Home from "./Home";
import Product from "./Product";
import Blogs from "./Blogs";
import Notification from "./Notification";
import Recipies from "./Recipies";
import HelpElker from "./Help";
import AddBlog from "./AddBlog";
import AddProduct from "./AddProduct";
import Chat from "./Chat";
import Settings from "./Settings";
import Supermarkets from "./Supermarkets";
import AddSuperMarket from "./AddSupermarket";
import RecipesDetail from "./RecipesDetail";
import BlogsDetail from "./BlogDetail";
import AddRecipes from "./AddRecipes";
import HelpDetail from "./HelpDetail";
import AddCategory from "./addCategory";
import Category from "./Category";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapseBar, setIsCollapseBar] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getCollpase = (value) => {
    setIsCollapseBar(value);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex lg:flex-row flex-col w-full">
      <div className={`${isCollapseBar ? "lg:w-[10%]" : "lg:w-[20%]"}`}>
        <button
          className={`fixed top-3 left-4 z-50 ${
            isMobileMenuOpen ? "hidden" : ""
          } lg:hidden bg-gray-300 p-2 rounded-full`}
          onClick={toggleMobileMenu}
        >
          <Menu className="h-6 w-6" />
        </button>
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isCollapse={getCollpase}
        />
      </div>
      <motion.div
        initial={{ x: 0 }}
        animate={isLargeScreen && isCollapseBar ? { x: -50 } : {}}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className={`${
          isCollapseBar ? "lg:w-[90%] w-full" : "lg:w-[80%] w-full"
        }  overflow-y-auto}`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs-detail/:id" element={<BlogsDetail />} />
          <Route path="/add-blog" element={<AddBlog />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/recipies" element={<Recipies />} />
          <Route path="/add-recipies" element={<AddRecipes />} />
          <Route path="/recipes-detail/:id" element={<RecipesDetail />} />
          <Route path="/help-elker" element={<HelpElker />} />
          <Route path="/help-elker-detail/:id" element={<HelpDetail />} />
          <Route path="/supermarkets" element={<Supermarkets />} />
          <Route path="/add-supermarkets" element={<AddSuperMarket />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/account-settings" element={<Settings />} />
          <Route path="/category" element={<Category />} />
          <Route path="/add-category" element={<AddCategory />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          draggable
          pauseOnHover
          theme="light"
        />
      </motion.div>
    </div>
  );
}

export default Dashboard;
