import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUsers } from "react-icons/fa6";
import { HiOutlinePencil } from "react-icons/hi2";
import { RiFileList3Line } from "react-icons/ri";

const UserCounter = ({ countData }) => {
  const [count, setCount] = useState(0);
  const totalUsers = countData.value;

  useEffect(() => {
    let start = 0;
    const duration = 2000; // Total time for the counter animation in milliseconds
    const increment = Math.ceil(totalUsers / (duration / 16)); // Adjust increment dynamically

    const counter = setInterval(() => {
      start += increment;
      if (start >= totalUsers) {
        setCount(totalUsers);
        clearInterval(counter);
      } else {
        setCount(start);
      }
    }, 16); // 16ms interval for smooth animation (approx 60 FPS)

    return () => clearInterval(counter);
  }, [totalUsers]);

  return (
    <div className="flex flex-col items-center bg-gray-100 w-full">
      <motion.div
        className="bg-white p-4 rounded-[30px] w-full shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          {/* <ImageTag path={countData.image} classes="size-12" altText="logo" /> */}
          <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center">
            {countData.name === 'Total Users' ? (<FaUsers className="w-6 h-6"/>) : countData.name === 'Total Products' ? ( <HiOutlinePencil className="w-6 h-6"/>) : (<RiFileList3Line className="w-6 h-6"/>)}
            
           
          </div>
          <h2 className="text-base font-HelveticaNeueMedium pl-3">
            {countData.name}
          </h2>
        </div>
        <motion.div
          className="text-3xl pt-3 font-HelveticaNeueMedium text-darkColor"
          key={count}
          initial={{}}
          animate={{}}
          transition={{ duration: 0.3 }}
        >
          {count.toLocaleString()}
        </motion.div>
        <p className="text-gray-600 pt-2">{countData.lastTotal}</p>
      </motion.div>
    </div>
  );
};

export default UserCounter;
