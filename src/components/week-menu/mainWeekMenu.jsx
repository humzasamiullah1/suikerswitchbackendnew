import React, { useState, useEffect } from "react";
import { Plus, CircleArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
// import { getBlogs, deleteBlog } from "../utils/firebasefunctions";
// import WarningPopup from "../popup/warning";
// import NoData from "../reuseable/noData";
// import MyLoader from "../reuseable/myLoader";
// import { toast } from "react-toastify";

// import ReactPaginate from "react-paginate";

const MainWeekMenu = () => {
  //   const [search, setSearch] = useState("");

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
              <p className="text-sm pr-3">Add Weekly Menu</p>
              <CircleArrowDown className="h-4 w-4" />
            </motion.button>
          </Link>
        </div>
      </div>
      {/* {!loading ? (
        <>
          <div className="lg:h-[78%] lg:overflow-y-scroll panelScroll">
            {currentProducts.length > 0 ? (
              currentProducts.map((item, index) => (
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
          {pageCount > 1 && (
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
          )}
        </>
      ) : (
        <div className="flex w-full h-[350px] md:h-[400px] lg:h-full items-center justify-center">
          <MyLoader />
        </div>
      )} */}
      {/* {warning && (
        <WarningPopup
          name="blog"
          itemId={onDeleteId}
          onClose={() => setWarning(false)}
          onDelete={(id) => handleDelete(id)}
        />
      )} */}
    </motion.div>
  );
};

export default MainWeekMenu;
