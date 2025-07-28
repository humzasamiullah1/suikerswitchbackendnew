import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Plus, CircleArrowDown } from "lucide-react";
import { motion } from "framer-motion";

import NoData from "../reuseable/noData";
import MyLoader from "../reuseable/myLoader";
import WarningPopup from "../popup/warning";
import ViewIngrediants from "../popup/view-ingrediants";

import { toast } from "react-toastify";

import MenuCard from "./menuCard";

import { getWeeklyMenu, deleteWeeklyMenu } from "../utils/firebasefunctions";

const MainWeekMenu = () => {
  //   const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(true);
  const [warning, setWarning] = useState(false);
  const [onDeleteId, setOnDeleteId] = useState("");

  const fetchData = async () => {
    const data = await getWeeklyMenu();
    console.log(data);
    setMenu(data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const openConfirmPopup = (id) => {
    setOnDeleteId(id);
    setWarning(true);
  };

  const handleDelete = async (id) => {
    await deleteWeeklyMenu(id);
    setWarning(false);
    toast.success("Menu Deleted Successfully");
    fetchData();
  };

  return (
    <motion.div
      className="bg-white rounded-[30px] shadow-md px-5 h-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header Section */}
      <div className="flex lg:flex-row flex-col justify-between items-center pt-5 lg:h-[12%]">
        <div className="flex justify-between w-full items-center lg:w-[30%] xl:w-[50%]">
          <p className="font-HelveticaNeueMedium text-darkColor text-lg">
            All Weekly Menu
          </p>
          <Link to={"/dashboard/add-weekly-menu"}>
            <motion.div
              className="bg-gkRedColor md:hidden size-10 rounded-full text-white flex justify-center items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus size={20} />
            </motion.div>
          </Link>
        </div>
        <div className="flex items-center lg:w-[70%] xl:w-[50%] justify-end">
          <Link to={"/dashboard/add-weekly-menu"}>
            <motion.button
              className="border hidden rounded-full px-4 w-full py-2 md:flex items-center font-HelveticaNeueRegular text-white bg-gkRedColor hover:bg-gkRedColor/90"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="text-sm pr-3">Add New Weekly Menu</p>
              <CircleArrowDown className="h-4 w-4" />
            </motion.button>
          </Link>
        </div>
      </div>
      {!loading ? (
        <>
          <div className="lg:h-[88%] lg:overflow-y-scroll panelScroll flex flex-row flex-wrap">
            {menu.length > 0 ? (
              menu.map((item, index) => (
                <motion.div
                  key={index}
                  className="w-full md:w-[48%]  mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    delay: index * 0.1,
                  }}
                >
                  <MenuCard
                    imageconfig=" w-[25%] sm:w-[20%] md:w-[40%]"
                    data={item}
                    onDelete={() => openConfirmPopup(item.id)}
                  />
                </motion.div>
              ))
            ) : (
              <div className="flex w-full h-[350px] md:h-[400px] lg:h-full items-center justify-center">
                <NoData />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex w-full h-[350px] md:h-[400px] lg:h-full items-center justify-center">
          <MyLoader />
        </div>
      )}
      {warning && (
        <WarningPopup
          name="menu"
          itemId={onDeleteId}
          onClose={() => setWarning(false)}
          onDelete={(id) => handleDelete(id)}
        />
      )}
    </motion.div>
  );
};

export default MainWeekMenu;
