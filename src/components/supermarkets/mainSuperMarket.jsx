import React, { useState, useEffect } from "react";
import { Search, CircleArrowDown, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Card from "./card";
import { getSupermarkets, deleteSupermarket } from "../utils/firebasefunctions";
import WarningPopup from "../popup/warning";
import { toast } from "react-toastify";
import NoData from "../reuseable/noData";
import MyLoader from "../reuseable/myLoader";

const MainSuperMarket = () => {
  const [search, setSearch] = useState("");
  const [supermarkets, setSupermarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState(false);
  const [onDeleteId, setOnDeleteId] = useState("");

  const fetchData = async () => {
    const data = await getSupermarkets();
    setSupermarkets(data);
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
    // const confirmDelete = window.confirm(
    //   "Are you sure you want to delete this supermarket?"
    // );
    // if (confirmDelete) {
    await deleteSupermarket(id);
    setWarning(false);
    toast.success("Supermarket Delete Successfully");
    fetchData();
    // }
  };

  // 🔹 Filter supermarkets based on search value
  const filteredSupermarkets = supermarkets.filter(
    (supermarket) =>
      supermarket.supermarketName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      supermarket.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white rounded-[30px] shadow-md px-5 h-full"
    >
      <div className="flex lg:flex-row flex-col justify-between items-center pt-5 lg:h-[12%]">
        <div className="flex justify-between w-full items-center lg:w-[20%] xl:w-[35%] 2xl:w-[40%]">
          <p className="font-HelveticaNeueMedium text-darkColor text-lg">
            All Supermarkets
          </p>
          <Link to={"/dashboard/add-product"}>
            <div className="bg-gkRedColor md:hidden size-10 rounded-full text-white flex justify-center items-center">
              <Plus size={20} />
            </div>
          </Link>
        </div>
        <div className="flex items-center w-full lg:w-[80%] xl:w-[75%] 2xl:w-[60%] justify-end">
          <div className="flex items-center gap-2 mt-3 md:mt-0 w-full lg:w-auto">
            <div className="relative w-full lg:w-auto">
              <input
                type="text"
                placeholder="Search by name or desc"
                className="border bg-gray-200 font-HelveticaNeueRegular placeholder:text-darkColor text-darkColor rounded-full py-2 pl-4 pr-8 focus:outline-none text-sm w-full lg:w-auto"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-3 top-3 h-4 w-4 text-darkColor" />
            </div>
            <Link to={"/dashboard/add-supermarkets"}>
              <button className="border hidden rounded-full px-4 w-full py-2 md:flex items-center font-HelveticaNeueRegular text-white bg-gkRedColor hover:bg-gkRedColor/90">
                <p className="text-sm pr-3">Add New Supermarkets</p>
                <CircleArrowDown className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 🔹 Search Result Section */}
      {!loading ? (
        <motion.div
          className="flex flex-wrap gap-4 lg:h-[88%] lg:overflow-y-scroll panelScroll"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {filteredSupermarkets.length > 0 ? (
            filteredSupermarkets.map((item, index) => (
              <motion.div
                key={index}
                className="w-full md:w-[32%] xl:w-[23%]"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* handleDelete(item.id) */}
                <Card
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
        </motion.div>
      ) : (
        <div className="flex w-full h-[350px] md:h-[400px] lg:h-full items-center justify-center">
          <MyLoader />
        </div>
      )}
      {warning && (
        <WarningPopup
          name="supermarket"
          itemId={onDeleteId}
          onClose={() => setWarning(false)}
          onDelete={(id) => handleDelete(id)}
        />
      )}
    </motion.div>
  );
};

export default MainSuperMarket;
