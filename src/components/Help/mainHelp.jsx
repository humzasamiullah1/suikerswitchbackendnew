import React, { useState, useEffect } from "react";
import { Search, Menu } from "lucide-react";
import HelpCard from "./helpCard";
import RequestCard from "./requestCard";
import LikePopup from "../popup/like";
import { motion, AnimatePresence } from "framer-motion";
import CommentsPopup from "../../components/popup/comments";
import { getHelpElker, deleteHelp } from "../utils/firebasefunctions";
import { toast } from "react-toastify";
import WarningPopup from "../popup/warning"

const MainHelp = () => {
  const [search, setSearch] = useState("");
  const [isLikePopup, setIsLikePopup] = useState(false);
  const [isCommentPopup, setIsCommentPopup] = useState(false);
  const [warning, setWarning] = useState(false);
  const [onDeleteId, setOnDeleteId] = useState("");
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

  const [helpConfirmData, setHelpConfirmData] = useState([]);
  const [helpPendingData, setHelpPendingData] = useState([]);

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
  };

  useEffect(() => {
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

  const filteredHelpConfirm = helpConfirmData.filter(
    (help) =>
      help.description.toLowerCase().includes(search.toLowerCase()) ||
      help.content.toLowerCase().includes(search.toLowerCase())
  );

  const filteredHelpPending = helpPendingData.filter(
    (help) =>
      help.description.toLowerCase().includes(search.toLowerCase()) ||
      help.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
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
            <p className="text-center text-gray-500 w-full mt-10">
              No data found
            </p>
          )}
        </div>
      </motion.div>

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
            {/* <div className="flex items-center gap-2 mt-3 md:mt-0"> */}
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
            {/* </div> */}
          </div>
        </div>

        {/* help List Section */}
        <div className="lg:h-[88%] w-full flex lg:flex-row flex-col justify-between">
          <div className="w-full lg:w-[73%] lg:overflow-y-scroll panelScroll h-full">
            {filteredHelpConfirm.length > 0 ? (
              filteredHelpConfirm.map((item, index) => (
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
              <p className="text-center text-gray-500 w-full mt-10">
                No data found
              </p>
            )}
          </div>
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
                  <RequestCard data={item} />
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500 w-full mt-10">
                No data found
              </p>
            )}
          </motion.div>
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
