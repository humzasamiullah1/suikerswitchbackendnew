import React, { useState } from "react";
import { motion } from "framer-motion";

import ChangePassword from "./changePassword";
import EditProfile from "./editProfile";

const MainSettings = () => {
  const [activeTab, setActiveTab] = useState("user");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Pehle invisible aur neeche se aayega
      animate={{ opacity: 1, y: 0 }} // Phir smoothly dikhai dega
      transition={{ duration: 0.6, ease: "easeOut" }} // 0.6s ka smooth transition
      className="bg-white rounded-[30px] shadow-md px-5 h-full mb-5 lg:mb-0"
    >
      <div className="flex lg:flex-row flex-col border-b-2 border-gray-100 justify-between items-center pt-2 lg:h-[10%]">
        <div className="flex justify-center lg:justify-start w-full items-center lg:w-[30%] xl:w-[50%]">
          <p className="font-HelveticaNeueMedium text-darkColor text-lg">
            Account Setting
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-between h-[90%]  pt-3">
        <div className="w-[70%] mx-auto mt-10 bg-white  shadow-lg rounded-lg">
          {/* Tab Headers with Indicator */}
          <div className="relative flex">
            <button
              className={`flex-1 py-3 text-center text-base font-HelveticaNeueMedium transition ${
                activeTab === "user" ? "text-gkRedColor" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("user")}
            >
              User
            </button>
            <button
              className={`flex-1 py-3 text-center text-base font-HelveticaNeueMedium transition ${
                activeTab === "changePassword"
                  ? "text-gkRedColor"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("changePassword")}
            >
              Change Password
            </button>

            {/* Bottom indicator animation */}
            <div
              className={`absolute bottom-0 h-1 bg-gkRedColor transition-all duration-300 rounded-full`}
              style={{
                width: "50%",
                left: activeTab === "user" ? "0%" : "50%",
              }}
            />
          </div>
        </div>
        <div className="p-5 w-[70%] mx-auto h-full overflow-scroll panelScroll">
          {activeTab === "user" && (
            <div className="animate-fadeIn">
              <EditProfile />
            </div>
          )}
          {activeTab === "changePassword" && (
            <div className="animate-fadeIn">
              <ChangePassword />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MainSettings;
