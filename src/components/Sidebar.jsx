"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ImageTag from "../components/reuseable/imageTag";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { toast } from "react-toastify";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  X,
  House,
  Pencil,
  StickyNote,
  ReceiptText,
  Store,
  LogOut,
  ChartBarStacked
} from "lucide-react";

// ✅ Menu Items Array with Multiple Paths
const menuItems = [
  { title: "Home", icon: House, paths: ["/dashboard"] },
  { 
    title: "Products", 
    icon: Pencil, 
    paths: [
      "/dashboard/products",
      "/dashboard/add-product"
    ]
  },
  { 
    title: "Blogs", 
    icon: StickyNote, 
    paths: [
      "/dashboard/blogs",
      "/dashboard/add-blog",
      "/dashboard/blogs-detail"
    ] 
  },
  { 
    title: "Recipes", 
    icon: ReceiptText, 
    paths: [
      "/dashboard/recipies",
      "/dashboard/recipes-detail",
      "/dashboard/add-recipies"
    ] 
  },
  { 
    title: "Help Elkar", 
    icon: StickyNote, 
    paths: [
      "/dashboard/help-elker",
      "/dashboard/help-elker-detail"
    ] 
  },
  {
    title: "Supermarkets",
    icon: Store,
    paths: [
      "/dashboard/supermarkets",
      "/dashboard/add-supermarkets",
    ],
  },
  {
    title: "Category",
    icon: ChartBarStacked,
    paths: [
      "/dashboard/add-category",
    ],
  },
  { title: "Settings", icon: Settings, paths: ["/dashboard/account-settings"] },
];

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen, isCollapse }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully!");
            navigate("/");
        } catch (error) {
            toast.error("Logout failed. Please try again.");
            console.error("Logout Error:", error);
        }
    };

  // ✅ Corrected Active State Logic
  const isActive = (paths) =>
    paths.some((path) => location.pathname === path);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    isCollapse(isOpen);
  };

  const sidebarVariants = {
    open: { width: "20%" },
    closed: { width: "80px", minWidth: "80px" },
  };

  const menuItemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -10 },
  };

  const mobileSidebarVariants = {
    open: { y: 0, opacity: 1 },
    closed: { y: "-15%", opacity: 0 },
  };

  return (
    <AnimatePresence>
      {(isLargeScreen || isMobileMenuOpen) && (
        <motion.aside
          className={`fixed top-0 left-0 z-40 h-screen w-full bg-white shadow-md overflow-y-auto ${
            isLargeScreen ? "" : "w-full"
          }`}
          initial={isLargeScreen ? "open" : "closed"}
          animate={isLargeScreen ? (isOpen ? "open" : "closed") : "open"}
          exit="closed"
          variants={isLargeScreen ? sidebarVariants : mobileSidebarVariants}
        >
          <div className="h-[87%]">
            <div
              className={`flex items-center ${
                isOpen ? "justify-between" : "justify-center"
              } py-4 px-2 border-b`}
            >
              {isOpen && (
                <motion.span
                  variants={menuItemVariants}
                  className="text-xl font-semibold w-full flex justify-center"
                >
                  <ImageTag
                    path="/assets/images/round-logo.png"
                    classes="size-24"
                    altText="login"
                  />
                </motion.span>
              )}
              {isLargeScreen && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-200"
                >
                  {isOpen ? <ChevronLeft /> : <ChevronRight />}
                </button>
              )}
              {!isLargeScreen && (
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-200"
                >
                  <X />
                </button>
              )}
            </div>
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => (
                <div
                  key={item.title}
                  className="w-[95%] md:w-[40%] lg:w-full mx-auto"
                >
                  <Link
                    to={item.paths[0]}
                    className={`flex items-center py-2 px-4 rounded-full text-darkColor hover:bg-gkRedColor hover:text-white transition-colors ${
                      isActive(item.paths)
                        ? "bg-gkRedColor text-white"
                        : "text-darkColor hover:bg-gkRedColor hover:text-white"
                    }`}
                    onClick={() =>
                      !isLargeScreen && setIsMobileMenuOpen(false)
                    }
                  >
                    <item.icon className="h-5 w-5 min-w-[20px]" />
                    {isOpen && (
                      <motion.span
                        variants={menuItemVariants}
                        className="pl-3"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
          <div className="p-4 space-y-2 h-[13%] w-[60%] md:w-[40%] lg:w-full mx-auto">
            <div
              className="flex items-center py-2 px-4 rounded-md text-darkColor hover:bg-gkRedColor hover:text-white transition-colors"
              onClick={() => !isLargeScreen && setIsMobileMenuOpen(false)}
            >
              <LogOut className="h-5 w-5 min-w-[20px]" />
              {isOpen && (
                <motion.span variants={menuItemVariants} className="pl-3" onClick={handleLogout}>
                  LogOut
                </motion.span>
              )}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
