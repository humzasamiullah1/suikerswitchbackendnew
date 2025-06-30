import React from "react";

import { motion } from "framer-motion";

import BreadCrumbs from "../reuseable/breadCrumbs";
import FormSection from "./formSection";
import BulkFormSection from "./BulkFormSection";

const MainAddWeekMenu = (props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Pehle invisible aur neeche se aayega
      animate={{ opacity: 1, y: 0 }} // Phir smoothly dikhai dega
      transition={{ duration: 0.6, ease: "easeOut" }} // 0.6s ka smooth transition
      className="bg-white rounded-[30px] shadow-md px-5 h-full mb-5 lg:mb-0 overflow-y-scroll panelScroll"
    >
      <div className="flex lg:flex-row flex-col border-b-2 border-gray-100 justify-between items-center pt-2 lg:h-[12%]">
        <div className="flex flex-col justify-center w-full lg:w-[30%] xl:w-[50%]">
          <p className="font-HelveticaNeueMedium text-darkColor text-lg">
            Add Weekly Menu
          </p>
          <BreadCrumbs
            link={"/dashboard/weekly-menu"}
            firstLink="Weekly Menu"
            secondLink="Add Weekly Menu"
          />
        </div>
        <button
          onClick={props.onClick}
          className="border hidden rounded-full px-4  py-2 md:flex items-center font-HelveticaNeueRegular text-white bg-gkRedColor hover:bg-gkRedColor/90"
        >
          <p className="text-sm ">
            {props.bulkenabled ? "Add Weekly Menu" : "Bulk Upload"}
          </p>
        </button>
      </div>

      {props.bulkenabled ? <BulkFormSection /> : <FormSection />}
    </motion.div>
  );
};

export default MainAddWeekMenu;
