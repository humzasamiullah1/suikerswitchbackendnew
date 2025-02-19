import React, { useState } from "react";
import { CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import NotificationCard from "./notiCard";

const MainNotification = () => {
  const [cardData, setCardData] = useState([
    {
      title: "Robert Johnson",
      time: "1m ago",
      msg: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33",
    },
    {
      title: "Ella Lewis",
      time: "1m ago",
      msg: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33",
    },
    {
      title: "Emily Brown",
      time: "1m ago",
      msg: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33",
    },
    {
      title: "Robert Johnson",
      time: "1m ago",
      msg: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33",
    },
    {
      title: "Ella Lewis",
      time: "1m ago",
      msg: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33",
    },
    {
      title: "Emily Brown",
      time: "1m ago",
      msg: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33",
    },
    {
      title: "Robert Johnson",
      time: "1m ago",
      msg: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33",
    },
    {
      title: "Ella Lewis",
      time: "1m ago",
      msg: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33",
    },
    {
      title: "Emily Brown",
      time: "1m ago",
      msg: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33",
    },
    {
      title: "Robert Johnson",
      time: "1m ago",
      msg: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33",
    },
    {
      title: "Ella Lewis",
      time: "1m ago",
      msg: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33",
    },
    {
      title: "Emily Brown",
      time: "1m ago",
      msg: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33",
    },
    {
      title: "Robert Johnson",
      time: "1m ago",
      msg: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33",
    },
    {
      title: "Ella Lewis",
      time: "1m ago",
      msg: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33",
    },
    {
      title: "Emily Brown",
      time: "1m ago",
      msg: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33",
    },
    {
      title: "Robert Johnson",
      time: "1m ago",
      msg: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33",
    },
    {
      title: "Ella Lewis",
      time: "1m ago",
      msg: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33",
    },
    {
      title: "Emily Brown",
      time: "1m ago",
      msg: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33",
    },
  ]);

  return (
    <motion.div
      className="bg-white rounded-[30px] shadow-md px-5 h-full"
      initial={{ opacity: 0, y: 30 }} // Start position
      animate={{ opacity: 1, y: 0 }} // End position
      transition={{ duration: 0.5, ease: "easeOut" }} // Smooth animation
    >
      <div className="flex justify-between items-center lg:h-[10%] py-5 lg:py-0">
        <p className="text-darkColor font-HelveticaNeueMedium text-base">
          Notification
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }} // Hover effect
          whileTap={{ scale: 0.95 }} // Click effect
          className="font-HelveticaNeueMedium bg-gray-200 cursor-pointer text-sm flex items-center rounded-full px-3 py-1"
        >
          <p className="pr-2">Mark as all Read</p>
          <CheckCheck size={18} />
        </motion.div>
      </div>
      <div className="flex flex-wrap w-full lg:h-[88%] lg:overflow-y-scroll panelScroll">
        {cardData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }} // Cards animation start
            animate={{ opacity: 1, y: 0 }} // Cards animation end
            transition={{ duration: 0.4, delay: index * 0.1 }} // Staggered animation
            className="w-full"
          >
            <NotificationCard data={item} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MainNotification;
