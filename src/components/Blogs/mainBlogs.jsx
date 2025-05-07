import React, { useState, useEffect } from "react";
import { Search, Menu, CircleArrowDown, Plus } from "lucide-react";
import BlogCard from "./blogCard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getBlogs, deleteBlog } from "../utils/firebasefunctions";
import WarningPopup from "../popup/warning";
import NoData from "../reuseable/noData";
import MyLoader from "../reuseable/myLoader";
import { toast } from "react-toastify";

import ReactPaginate from "react-paginate";

const MainBlogs = () => {
  const [search, setSearch] = useState("");

  const [blogsData, setBlogsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState(false);
  const [onDeleteId, setOnDeleteId] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 30;

  const fetchData = async () => {
    const data = await getBlogs();
    setBlogsData(data);

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
    await deleteBlog(id);
    setWarning(false);
    toast.success("Blog Deleted Successfully");
    fetchData();
  };

  const searchedProducts = blogsData.filter(
    (blog) =>
      blog?.description?.toLowerCase()?.includes(search.toLowerCase()) ||
      blog?.content?.toLowerCase()?.includes(search.toLowerCase())
  );

  // const pageCount = Math.ceil(searchedProducts.length / productsPerPage);
  // const currentProducts = searchedProducts.slice(
  //   currentPage * productsPerPage,
  //   (currentPage + 1) * productsPerPage
  // );

  // const handlePageClick = ({ selected }) => {
  //   setCurrentPage(selected);
  // };

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
          <Link to={"/dashboard/add-blog"}>
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
      {!loading ? (
        <>
          <div className="lg:h-[88%] lg:overflow-y-scroll panelScroll">
            {searchedProducts.length > 0 ? (
              searchedProducts.map((item, index) => (
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
                    isShow={true}
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
          {/* {pageCount > 1 && (
            <div className="lg:h-[10%] pb-5 lg:pb-0">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={
                  "pagination flex justify-center mt-4 space-x-2 font-HelveticaNeueMedium text-sm"
                }
                pageClassName={"px-3 py-2 bg-gray-200 rounded-md"}
                activeClassName={"!bg-gkRedColor !text-white"}
                previousClassName={"px-4 py-2 bg-gray-300 rounded-md"}
                nextClassName={"px-4 py-2 bg-gray-300 rounded-md"}
                disabledClassName={"opacity-50 cursor-not-allowed"}
              />
            </div>
          )} */}
        </>
      ) : (
        <div className="flex w-full h-[350px] md:h-[400px] lg:h-full items-center justify-center">
          <MyLoader />
        </div>
      )}
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
