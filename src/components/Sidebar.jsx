import { useState } from "react";
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
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md p-5 transition-transform transform ${
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
              href="#"
              className="flex items-center px-6 py-[10px] bg-gkRedColor text-white rounded-full"
            >
              <House size={20} />{" "}
              <span className="font-HelveticaNeueRegular pl-3">Home</span>
            </Link>
            <Link
              href="#"
              className="flex items-center px-6 py-[10px] text-darkColor hover:bg-gkRedColor hover:text-white rounded-full"
            >
              <Pencil size={20} />
              <span className="font-HelveticaNeueRegular pl-3"> Products</span>
            </Link>
            <Link
              href="#"
              className="flex items-center px-6 py-[10px] text-darkColor hover:bg-gkRedColor hover:text-white rounded-full"
            >
              <StickyNote size={20} />
              <span className="font-HelveticaNeueRegular pl-3"> Blogs</span>
            </Link>
            <Link
              href="#"
              className="flex items-center px-6 py-[10px] text-darkColor hover:bg-gkRedColor hover:text-white rounded-full"
            >
              <ReceiptText size={20} />
              <span className="font-HelveticaNeueRegular pl-3"> Recipes</span>
            </Link>
            <Link
              href="#"
              className="flex items-center px-6 py-[10px] text-darkColor hover:bg-gkRedColor hover:text-white rounded-full"
            >
              <MessageCircle size={20} />
              <span className="font-HelveticaNeueRegular pl-3"> Posts</span>
            </Link>
            <Link
              href="#"
              className="flex items-center px-6 py-[10px] text-darkColor hover:bg-gkRedColor hover:text-white rounded-full"
            >
              <StickyNote size={20} />
              <span className="font-HelveticaNeueRegular pl-3">
                Help Elkar Screen
              </span>
            </Link>
            <Link
              href="#"
              className="flex items-center px-6 py-[10px] text-darkColor hover:bg-gkRedColor hover:text-white rounded-full"
            >
              <Settings size={20} />
              <span className="font-HelveticaNeueRegular pl-3"> Settings</span>
            </Link>
          </nav>
        </div>
        <div className="h-[10%]">
          <Link
            href="#"
            className="flex items-center px-6 py-[10px] text-darkColor hover:bg-gkRedColor hover:text-white rounded-full"
          >
            <LogOut size={20} />
            <span className="font-HelveticaNeueRegular pl-3"> Log Out</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
