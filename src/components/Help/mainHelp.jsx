import React, { useState, useEffect } from "react";
import { Search, Menu } from "lucide-react";
import HelpCard from "./helpCard";
import RequestCard from "./requestCard";
import LikePopup from "../popup/like";
import { motion, AnimatePresence } from "framer-motion";
import CommentsPopup from "../../components/popup/comments";
import NoData from "../reuseable/noData";
import {
  getHelpElker,
  deleteHelp,
  AcceptHelpElker,
} from "../utils/firebasefunctions";
import { toast } from "react-toastify";
import WarningPopup from "../popup/warning";
import { serverTimestamp } from "firebase/firestore";
import MyLoader from "../reuseable/myLoader";

import ReactPaginate from "react-paginate";

const MainHelp = () => {
  const [search, setSearch] = useState("");
  const [isLikePopup, setIsLikePopup] = useState(false);
  const [isCommentPopup, setIsCommentPopup] = useState(false);
  const [warning, setWarning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [onDeleteId, setOnDeleteId] = useState("");

  const [helpConfirmData, setHelpConfirmData] = useState([]);
  const [helpPendingData, setHelpPendingData] = useState([]);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 30;

  const fetchData = async () => {
    const data = await getHelpElker();
    const filterPending = data.filter(
      (status) => status.status.toLowerCase() === "pending"
    );
    const filterConfirm = data.filter(
      (status) => status.status.toLowerCase() === "confirmed"
    );
    setHelpPendingData(filterPending);
    setHelpConfirmData(filterConfirm);
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
    await deleteHelp(id);
    setWarning(false);
    toast.success("Help and elker Deleted Successfully");
    fetchData();
  };

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

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const searchedProducts = helpConfirmData.filter(
    (help) =>
      help.description.toLowerCase().includes(search.toLowerCase()) ||
      help.content.toLowerCase().includes(search.toLowerCase())
  );

  const filteredHelpPending = helpPendingData.filter(
    (help) =>
      help.description.toLowerCase().includes(search.toLowerCase()) ||
      help.content.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = async (id, filterData, status) => {
    try {
      await AcceptHelpElker(id, filterData);
      if (status === "confirm") {
        toast.success("Help Elker Accepted successfully!");
      } else {
        toast.success("Help Elker Rejected successfully!");
      }
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      // alert(error.message);
    } finally {
      // setLoading(false); // Stop Loading
    }
  };

  const handleAccept = (id) => {
    const filterData = filteredHelpPending.find((x) => x.id === id);
    const data = {
      content: filterData.content,
      description: filterData.description,
      images: filterData.images,
      status: "confirmed",
      userId: filterData?.userId,
      createAt: serverTimestamp(),
    };
    updateStatus(filterData.id, data, "confirm");
  };

  const handleReject = (id) => {
    const filterData = filteredHelpPending.find((x) => x.id === id);
    const data = {
      content: filterData.content,
      description: filterData.description,
      images: filterData.images,
      status: "reject",
      userId: filterData?.userId,
      createAt: serverTimestamp(),
    };
    updateStatus(filterData.id, data, "reject");
  };

  const pageCount = Math.ceil(searchedProducts.length / productsPerPage);
  const currentProducts = searchedProducts.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <AnimatePresence>
      {!loading ? (
        <motion.div
          className="w-full lg:w-[25%] mt-5 lg:mt-0 h-full lg:hidden bg-white border border-gray-100 rounded-xl overflow-x-auto whitespace-nowrap px-2 pb-2 mb-4"
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <div className="flex space-x-4">
            {filteredHelpPending.length > 0 ? (
              filteredHelpPending.map((item, index) => (
                <motion.div
                  key={index}
                  className="w-[70%] sm:w-[50%] md:w-[30%] flex-shrink-0"
                  initial="hidden"
                  whileInView="visible"
                  variants={pageVariants}
                  viewport={{ once: true }}
                >
                  <RequestCard data={item} />
                </motion.div>
              ))
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <NoData />
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          <MyLoader />
        </div>
      )}

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
          <div className="flex items-center py-6 lg:py-0 w-full lg:w-[70%] xl:w-[40%] justify-end">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search"
                className="border w-full bg-gray-200 font-HelveticaNeueRegular placeholder:text-darkColor text-darkColor rounded-full py-2 pl-5 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-3 top-3 h-4 w-4 text-darkColor" />
            </div>
          </div>
        </div>

        {/* help List Section */}
        <div className="lg:h-[88%] w-full flex lg:flex-row flex-col justify-between">
          {!loading ? (
            <>
              <div className="w-full lg:w-[73%] lg:overflow-y-scroll panelScroll h-full">
                {currentProducts.length > 0 ? (
                  currentProducts.map((item, index) => (
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
                        onLikePopup={opeLikePopup}
                        onCommentsClick={opeCommentsPopup}
                        onDelete={() => openConfirmPopup(item.id)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="flex w-full h-[300px] lg:h-full items-center justify-center">
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
            <div className="flex w-full h-[300px] lg:h-full items-center justify-center">
              <MyLoader />
            </div>
          )}
          {!loading ? (
            <motion.div
              className="w-full lg:w-[25%] mt-5 lg:mt-0 h-full hidden lg:block lg:overflow-y-scroll panelScroll bg-white border border-gray-100 rounded-xl"
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              {filteredHelpPending.length > 0 ? (
                filteredHelpPending.map((item, index) => (
                  <motion.div
                    key={index}
                    className="w-[95%] mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    variants={pageVariants}
                    viewport={{ once: true }}
                  >
                    <RequestCard
                      data={item}
                      onAccept={(id) => handleAccept(id)}
                      onReject={(id) => handleReject(id)}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="flex w-full h-full items-center justify-center">
                  <NoData />
                </div>
              )}
            </motion.div>
          ) : (
            <div className="flex w-full h-full items-center justify-center">
              <MyLoader />
            </div>
          )}
        </div>
        {warning && (
          <WarningPopup
            name="Help and elker"
            itemId={onDeleteId}
            onClose={() => setWarning(false)}
            onDelete={(id) => handleDelete(id)}
          />
        )}
        {isLikePopup && <LikePopup onClose={closeLikePopup} />}
        {isCommentPopup && <CommentsPopup onClose={closeCommentsPopup} />}
      </motion.div>
    </AnimatePresence>
  );
};

export default MainHelp;
