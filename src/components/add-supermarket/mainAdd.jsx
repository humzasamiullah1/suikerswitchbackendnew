import React from "react";
import { motion } from "framer-motion";
import FormSection from "./FormSection"

const MainAddSupermarket = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Pehle invisible aur neeche se aayega
      animate={{ opacity: 1, y: 0 }} // Phir smoothly dikhai dega
      transition={{ duration: 0.6, ease: "easeOut" }} // 0.6s ka smooth transition
      className="bg-white rounded-[30px] shadow-md px-5 h-full mb-5 lg:mb-0"
    >
      <div className="flex lg:flex-row flex-col border-b-2 border-gray-100 justify-between items-center pt-2 lg:h-[12%]">
        <div className="flex justify-center lg:justify-start w-full items-center lg:w-[30%] xl:w-[50%]">
          <p className="font-HelveticaNeueMedium text-darkColor text-lg">
            Product Information
          </p>
        </div>
        <div className="flex items-center lg:w-[70%] xl:w-[50%] justify-end pb-3 lg:pb-0">
          <div className="flex items-center gap-2 mt-3 md:mt-0">
            <button className="border text-xs rounded-full px-4 py-2 flex items-center font-HelveticaNeueMedium text-darkColor bg-gray-200 hover:bg-gray-200">
              Cancel
            </button>
            <button className="border text-xs rounded-full px-4 w-full py-2 flex items-center font-HelveticaNeueMedium text-white bg-gkRedColor hover:bg-gkRedColor/90">
              Proceed
            </button>
          </div>
        </div>
      </div>
      <FormSection/>
    </motion.div>
  );
};

export default MainAddSupermarket;
