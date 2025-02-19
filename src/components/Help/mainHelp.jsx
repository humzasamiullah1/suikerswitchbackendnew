import React, { useState } from "react";
import { Search, Menu, Plus } from "lucide-react";
import HelpCard from "./helpCard";
import RequestCard from "./requestCard";
import LikePopup from "../popup/like";
import { motion, AnimatePresence } from "framer-motion";

const MainHelp = () => {
  const [search, setSearch] = useState("");
  const [isLikePopup, setIsLikePopup] = useState(false);
  const [blogsData, setBlogsData] = useState([
    {
      title: "Olivia Martin",
      time: "1m ago",
      description:
        "How Ketchup Revolutionized How Food Is Grown, Processed and Regulated | Smithsonian and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      like: 24,
      comments: 11,
    },
    {
      title: "Olivia Martin",
      time: "1m ago",
      description:
        "How Ketchup Revolutionized How Food Is Grown, Processed and Regulated | Smithsonian and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      like: 24,
      comments: 11,
    },
    {
      title: "Olivia Martin",
      time: "1m ago",
      description:
        "How Ketchup Revolutionized How Food Is Grown, Processed and Regulated | Smithsonian and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      like: 24,
      comments: 11,
    },
    {
      title: "Olivia Martin",
      time: "1m ago",
      description:
        "How Ketchup Revolutionized How Food Is Grown, Processed and Regulated | Smithsonian and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      like: 24,
      comments: 11,
    },
    {
      title: "Olivia Martin",
      time: "1m ago",
      description:
        "How Ketchup Revolutionized How Food Is Grown, Processed and Regulated | Smithsonian and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      like: 24,
      comments: 11,
    },
    {
      title: "Olivia Martin",
      time: "1m ago",
      description:
        "How Ketchup Revolutionized How Food Is Grown, Processed and Regulated | Smithsonian and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      like: 24,
      comments: 11,
    },
    {
      title: "Olivia Martin",
      time: "1m ago",
      description:
        "How Ketchup Revolutionized How Food Is Grown, Processed and Regulated | Smithsonian and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      like: 24,
      comments: 11,
    },
  ]);
  const [requestData, setRequestData] = useState([
    {
      name: "Natalie Clark",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in erat quis urna mollis vulputate sit amet quis mi. Integer et quam dui. Nulla efficitur eu felis id gravida. Proin ut molestie dolor. Mauris iaculis elementum vulputate. Morbi eget fringilla lectus. Nunc elementum nisi eu mi placerat vulputate.",
    },
    {
      name: "Natalie Clark",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in erat quis urna mollis vulputate sit amet quis mi. Integer et quam dui. Nulla efficitur eu felis id gravida. Proin ut molestie dolor. Mauris iaculis elementum vulputate. Morbi eget fringilla lectus. Nunc elementum nisi eu mi placerat vulputate.",
    },
    {
      name: "Natalie Clark",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in erat quis urna mollis vulputate sit amet quis mi. Integer et quam dui. Nulla efficitur eu felis id gravida. Proin ut molestie dolor. Mauris iaculis elementum vulputate. Morbi eget fringilla lectus. Nunc elementum nisi eu mi placerat vulputate.",
    },
    {
      name: "Natalie Clark",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in erat quis urna mollis vulputate sit amet quis mi. Integer et quam dui. Nulla efficitur eu felis id gravida. Proin ut molestie dolor. Mauris iaculis elementum vulputate. Morbi eget fringilla lectus. Nunc elementum nisi eu mi placerat vulputate.",
    },
    {
      name: "Natalie Clark",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in erat quis urna mollis vulputate sit amet quis mi. Integer et quam dui. Nulla efficitur eu felis id gravida. Proin ut molestie dolor. Mauris iaculis elementum vulputate. Morbi eget fringilla lectus. Nunc elementum nisi eu mi placerat vulputate.",
    },
    {
      name: "Natalie Clark",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in erat quis urna mollis vulputate sit amet quis mi. Integer et quam dui. Nulla efficitur eu felis id gravida. Proin ut molestie dolor. Mauris iaculis elementum vulputate. Morbi eget fringilla lectus. Nunc elementum nisi eu mi placerat vulputate.",
    },
    {
      name: "Natalie Clark",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in erat quis urna mollis vulputate sit amet quis mi. Integer et quam dui. Nulla efficitur eu felis id gravida. Proin ut molestie dolor. Mauris iaculis elementum vulputate. Morbi eget fringilla lectus. Nunc elementum nisi eu mi placerat vulputate.",
    },
    {
      name: "Natalie Clark",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in erat quis urna mollis vulputate sit amet quis mi. Integer et quam dui. Nulla efficitur eu felis id gravida. Proin ut molestie dolor. Mauris iaculis elementum vulputate. Morbi eget fringilla lectus. Nunc elementum nisi eu mi placerat vulputate.",
    },
    {
      name: "Natalie Clark",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in erat quis urna mollis vulputate sit amet quis mi. Integer et quam dui. Nulla efficitur eu felis id gravida. Proin ut molestie dolor. Mauris iaculis elementum vulputate. Morbi eget fringilla lectus. Nunc elementum nisi eu mi placerat vulputate.",
    },
    {
      name: "Natalie Clark",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in erat quis urna mollis vulputate sit amet quis mi. Integer et quam dui. Nulla efficitur eu felis id gravida. Proin ut molestie dolor. Mauris iaculis elementum vulputate. Morbi eget fringilla lectus. Nunc elementum nisi eu mi placerat vulputate.",
    },
    {
      name: "Natalie Clark",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in erat quis urna mollis vulputate sit amet quis mi. Integer et quam dui. Nulla efficitur eu felis id gravida. Proin ut molestie dolor. Mauris iaculis elementum vulputate. Morbi eget fringilla lectus. Nunc elementum nisi eu mi placerat vulputate.",
    },
    {
      name: "Natalie Clark",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in erat quis urna mollis vulputate sit amet quis mi. Integer et quam dui. Nulla efficitur eu felis id gravida. Proin ut molestie dolor. Mauris iaculis elementum vulputate. Morbi eget fringilla lectus. Nunc elementum nisi eu mi placerat vulputate.",
    },
  ]);

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <AnimatePresence>
    <motion.div
      className="bg-white rounded-[30px] shadow-md px-5 h-full"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: 20 }}
    >
      {/* Header Section */}
      <div className="flex lg:flex-row flex-col justify-between items-center pt-5 lg:h-[12%]">
        <div className="flex justify-between w-full items-center lg:w-[30%] xl:w-[60%]">
          <p className="font-HelveticaNeueMedium text-darkColor text-lg">
            Help Elkar
          </p>
        </div>
        <div className="flex items-center lg:w-[70%] xl:w-[40%] justify-end">
          <div className="flex items-center gap-2 mt-3 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="border bg-gray-200 font-HelveticaNeueRegular placeholder:text-darkColor text-darkColor rounded-full py-2 pl-5 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-3 top-3 h-4 w-4 text-darkColor" />
            </div>
            <motion.button
              className="border rounded-full px-4 py-2 flex items-center font-HelveticaNeueRegular text-darkColor bg-gray-200 hover:bg-gray-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="text-sm pr-3">Filters</p>
              <Menu className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Blog List Section */}
      <div className="lg:h-[88%] w-full flex lg:flex-row flex-col justify-between">
        <div className="w-full lg:w-[73%] lg:overflow-y-scroll panelScroll h-full">
          {blogsData.map((item, index) => (
            <motion.div
              key={index}
              className="w-full"
              initial="hidden"
              whileInView="visible"
              variants={pageVariants}
              viewport={{ once: true }}
            >
              <HelpCard
                data={item}
                onLikePopup={() => {
                  setIsLikePopup(true);
                }}
              />
            </motion.div>
          ))}
        </div>
        <motion.div
          className="w-full lg:w-[25%] mt-5 lg:mt-0 h-full lg:overflow-y-scroll panelScroll bg-white border border-gray-100 rounded-xl"
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          {requestData.map((item, index) => (
            <motion.div
              key={index}
              className="w-[95%] mx-auto"
              initial="hidden"
              whileInView="visible"
              variants={pageVariants}
              viewport={{ once: true }}
            >
              <RequestCard data={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
      {isLikePopup && <LikePopup />}
    </motion.div>
  </AnimatePresence>
  );
};

export default MainHelp;
