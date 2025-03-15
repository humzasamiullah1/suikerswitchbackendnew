import React, { useState, useEffect } from "react";
import { Search, Menu, CircleArrowDown, Plus } from "lucide-react";
import BlogCard from "./blogCard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getBlogs, deleteBlog } from "../utils/firebasefunctions";
import WarningPopup from "../popup/warning";
import { toast } from "react-toastify";

const MainBlogs = () => {
  const [search, setSearch] = useState("");

  const [blogsData, setBlogsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState(false);
  const [onDeleteId, setOnDeleteId] = useState("");

  const fetchData = async () => {
    const data = await getBlogs();
    setBlogsData(data);
    console.log(blogsData)
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openConfirmPopup = (id) => {
    setOnDeleteId(id);
    setWarning(true);
  };

  const handleDelete = async (id) => {
    await deleteBlog(id);
    setWarning(false);
    toast.success("Blog Deleted Successfully");
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

      <div className="lg:h-[88%] lg:overflow-y-scroll panelScroll">
        {blogsData.length > 0 &&
          blogsData.map((item, index) => (
            <motion.div
              key={index}
              className="w-[95%] md:w-[85%] lg:w-[75%] mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: index * 0.1,
              }}
            >
              <BlogCard
                data={item}
                onDelete={() => openConfirmPopup(item.id)}
              />
            </motion.div>
          ))}
      </div>
      {warning && (
        <WarningPopup
          name="blog"
          itemId={onDeleteId}
          onClose={() => setWarning(false)}
          onDelete={(id) => handleDelete(id)}
        />
      )}
    </motion.div>
  );
};

export default MainBlogs;
