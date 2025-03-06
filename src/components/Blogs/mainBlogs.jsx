import React, { useState, useEffect } from "react";
import { Search, Menu, CircleArrowDown, Plus } from "lucide-react";
import BlogCard from "./blogCard";
import LikePopup from "../../components/popup/like";
import CommentsPopup from "../../components/popup/comments";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getBlogs } from "../utils/firebasefunctions";

const MainBlogs = () => {
  const [search, setSearch] = useState("");
  const [isLikePopup, setIsLikePopup] = useState(false);
  const [isCommentPopup, setIsCommentPopup] = useState(false);
  // const [blogsData, setBlogsData] = useState([
  //   {
  //     title: "Olivia Martin",
  //     time: "1m ago",
  //     description:
  //       "How Ketchup Revolutionized How Food Is Grown, Processed and Regulated | Smithsonian and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  //     like: 24,
  //     comments: 11,
  //   },
  //   {
  //     title: "Olivia Martin",
  //     time: "1m ago",
  //     description:
  //       "How Ketchup Revolutionized How Food Is Grown, Processed and Regulated | Smithsonian and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  //     like: 24,
  //     comments: 11,
  //   },
  //   {
  //     title: "Olivia Martin",
  //     time: "1m ago",
  //     description:
  //       "How Ketchup Revolutionized How Food Is Grown, Processed and Regulated | Smithsonian and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  //     like: 24,
  //     comments: 11,
  //   },
  //   {
  //     title: "Olivia Martin",
  //     time: "1m ago",
  //     description:
  //       "How Ketchup Revolutionized How Food Is Grown, Processed and Regulated | Smithsonian and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  //     like: 24,
  //     comments: 11,
  //   },
  //   {
  //     title: "Olivia Martin",
  //     time: "1m ago",
  //     description:
  //       "How Ketchup Revolutionized How Food Is Grown, Processed and Regulated | Smithsonian and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  //     like: 24,
  //     comments: 11,
  //   },
  //   {
  //     title: "Olivia Martin",
  //     time: "1m ago",
  //     description:
  //       "How Ketchup Revolutionized How Food Is Grown, Processed and Regulated | Smithsonian and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  //     like: 24,
  //     comments: 11,
  //   },
  //   {
  //     title: "Olivia Martin",
  //     time: "1m ago",
  //     description:
  //       "How Ketchup Revolutionized How Food Is Grown, Processed and Regulated | Smithsonian and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  //     like: 24,
  //     comments: 11,
  //   },
  // ]);

  const [blogsData, setBlogsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBlogs();
      setBlogsData(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const opeLikePopup = () => {
    setIsLikePopup(true);
    document.body.style.overflow = "hidden"; // Page scroll band
  };

  const closeLikePopup = () => {
    setIsLikePopup(false);
    document.body.style.overflow = "auto"; // Page scroll wapas enable
  };

  const opeCommentsPopup = () => {
    setIsCommentPopup(true);
    document.body.style.overflow = "hidden"; // Page scroll band
  };

  const closeCommentsPopup = () => {
    setIsCommentPopup(false);
    document.body.style.overflow = "auto"; // Page scroll wapas enable
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
          <p className="font-HelveticaNeueMedium text-darkColor/50 text-lg">
            All Blogs
          </p>
          <motion.div
            className="bg-gkRedColor md:hidden size-10 rounded-full text-white flex justify-center items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus size={20} />
          </motion.div>
        </div>
        <div className="flex items-center lg:w-[70%] xl:w-[50%] justify-end">
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
            <Link to={"/dashboard/add-blog"}>
              <motion.button
                className="border hidden rounded-full px-4 w-full py-2 md:flex items-center font-HelveticaNeueRegular text-white bg-gkRedColor hover:bg-gkRedColor/90"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <p className="text-sm pr-3">Add New Blog</p>
                <CircleArrowDown className="h-4 w-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      {/* Blog List Section */}
      <div className="lg:h-[88%] lg:overflow-y-scroll panelScroll">
        {blogsData.map((item, index) => (
          <motion.div
            key={index}
            className="w-[95%] md:w-[85%] lg:w-[75%] mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <BlogCard
              data={item}
              onLikePopup={opeLikePopup}
              onCommentPopup={opeCommentsPopup}
            />
          </motion.div>
        ))}
      </div>
      {isLikePopup && <LikePopup onClose={closeLikePopup} />}

      {isCommentPopup && <CommentsPopup onClose={closeCommentsPopup} />}
    </motion.div>
  );
};

export default MainBlogs;
