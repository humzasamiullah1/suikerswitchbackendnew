import { useState } from "react";
import { useLocation } from "react-router-dom"; // ✅ Import useLocation
import {
  Menu,
  X,
  House,
  Pencil,
  StickyNote,
  ReceiptText,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import ImageTag from "../components/reuseable/imageTag";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // ✅ Get Current Route

  // ✅ Function to check if the route is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex">
      {/* Burger Menu for small screens */}
      <button
        className="lg:hidden p-2 text-gray-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        {!isOpen && <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed z-[999] top-0 left-0 h-full w-64 bg-white shadow-md p-5 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:relative flex flex-col lg:w-full lg:h-screen`}
      >
        <div className="flex flex-col space-y-4 w-full h-[90%]">
          <div className="flex justify-center relative">
            <ImageTag
              path="/assets/images/round-logo.png"
              classes="size-24"
              altText="login"
            />
            <div className="lg:hidden absolute top-0 right-0">
              {isOpen && <X size={24} onClick={() => setIsOpen(!isOpen)} />}
            </div>
          </div>
          <nav className="flex flex-col space-y-2 pt-5 w-full">
            <Link
              to="/dashboard"
              className={`flex items-center px-6 py-[10px] rounded-full ${
                isActive("/dashboard") ? "bg-gkRedColor text-white" : "text-darkColor hover:bg-gkRedColor hover:text-white"
              }`}
            >
              <House size={20} />
              <span className="font-HelveticaNeueRegular pl-3">Home</span>
            </Link>
            <Link
              to="/dashboard/products"
              className={`flex items-center px-6 py-[10px] rounded-full ${
                isActive("/dashboard/products") ? "bg-gkRedColor text-white" : "text-darkColor hover:bg-gkRedColor hover:text-white"
              }`}
            >
              <Pencil size={20} />
              <span className="font-HelveticaNeueRegular pl-3">Products</span>
            </Link>
            <Link
              to="/dashboard/blogs"
              className={`flex items-center px-6 py-[10px] rounded-full ${
                isActive("/dashboard/blogs") ? "bg-gkRedColor text-white" : "text-darkColor hover:bg-gkRedColor hover:text-white"
              }`}
            >
              <StickyNote size={20} />
              <span className="font-HelveticaNeueRegular pl-3">Blogs</span>
            </Link>
            <Link
              to="/recipes"
              className={`flex items-center px-6 py-[10px] rounded-full ${
                isActive("/recipes") ? "bg-gkRedColor text-white" : "text-darkColor hover:bg-gkRedColor hover:text-white"
              }`}
            >
              <ReceiptText size={20} />
              <span className="font-HelveticaNeueRegular pl-3">Recipes</span>
            </Link>
            <Link
              to="/posts"
              className={`flex items-center px-6 py-[10px] rounded-full ${
                isActive("/posts") ? "bg-gkRedColor text-white" : "text-darkColor hover:bg-gkRedColor hover:text-white"
              }`}
            >
              <MessageCircle size={20} />
              <span className="font-HelveticaNeueRegular pl-3">Posts</span>
            </Link>
            <Link
              to="/help"
              className={`flex items-center px-6 py-[10px] rounded-full ${
                isActive("/help") ? "bg-gkRedColor text-white" : "text-darkColor hover:bg-gkRedColor hover:text-white"
              }`}
            >
              <StickyNote size={20} />
              <span className="font-HelveticaNeueRegular pl-3">
                Help Elkar Screen
              </span>
            </Link>
            <Link
              to="/settings"
              className={`flex items-center px-6 py-[10px] rounded-full ${
                isActive("/settings") ? "bg-gkRedColor text-white" : "text-darkColor hover:bg-gkRedColor hover:text-white"
              }`}
            >
              <Settings size={20} />
              <span className="font-HelveticaNeueRegular pl-3">Settings</span>
            </Link>
          </nav>
        </div>
        <div className="h-[10%]">
          <Link
            to="/logout"
            className={`flex items-center px-6 py-[10px] rounded-full ${
              isActive("/logout") ? "bg-gkRedColor text-white" : "text-darkColor hover:bg-gkRedColor hover:text-white"
            }`}
          >
            <LogOut size={20} />
            <span className="font-HelveticaNeueRegular pl-3">Log Out</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
