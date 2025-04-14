import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import CategoryCard from "./categoryCard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  getCategory,
  deleteCategory,
} from "../utils/firebasefunctions";
import WarningPopup from "../popup/warning";
import { toast } from "react-toastify";
import NoData from "../reuseable/noData";
import MyLoader from "../reuseable/myLoader";

const MainCategory = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState([]);
  // const [productCache, setProductCache] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [onDeleteId, setOnDeleteId] = useState("");
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getCategory();
    console.log(data)
    setCategory(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
    setWarning(false);
    toast.success("Product Deleted Successfully");
    fetchData();
  };

  // Search filter
  const filteredCategory = category.filter(
    (supermarket) =>
      supermarket.categoryName?.toLowerCase()?.includes(search.toLowerCase())
  );


  const openConfirmPopup = (id) => {
    setOnDeleteId(id);
    setWarning(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Pehle invisible aur neeche se aayega
      animate={{ opacity: 1, y: 0 }} // Phir smoothly dikhai dega
      transition={{ duration: 0.6, ease: "easeOut" }} // 0.6s ka smooth transition
      className="bg-white rounded-[30px] shadow-md px-5 h-full"
    >
      <div className="flex lg:flex-row flex-col justify-between items-center pt-5 lg:h-[12%]">
        <div className="flex justify-between w-full items-center lg:w-[30%] xl:w-[50%]">
          <p className="font-HelveticaNeueMedium text-darkColor text-lg">
            All Category
          </p>
          <Link to={"/dashboard/add-category"}>
            <div className="bg-gkRedColor md:hidden size-10 rounded-full text-white flex justify-center items-center">
              <Plus size={20} />
            </div>
          </Link>
        </div>
        <div className="flex items-center lg:w-[70%] xl:w-[50%] justify-end ">
          <div className="flex items-center gap-2 mt-3 md:mt-0">
            {/* Search Input */}
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

            {/* Add Product Button */}
            <Link to={"/dashboard/add-category"}>
              <button className="border hidden rounded-full px-4 w-full py-2 md:flex items-center font-HelveticaNeueRegular text-white bg-gkRedColor hover:bg-gkRedColor/90">
                <p className="text-sm pr-3">Add New Category</p>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {!loading ? (
        <>
          {/* Cards Section with Staggered Animation */}
          <motion.div
            className="flex flex-wrap gap-1 lg:gap-3 lg:h-[78%] lg:overflow-y-scroll panelScroll pb-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }, // Har card thoda delay se aayega
              },
            }}
          >
            {filteredCategory.length > 0 ? (
              filteredCategory.map((item, index) => (
                <motion.div
                  key={index}
                  className="w-[49%] md:w-[32%] xl:w-[23%]"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <CategoryCard
                    data={item}
                    onDelete={() => openConfirmPopup(item.id)}
                    isShow={true}
                  />
                </motion.div>
              ))
            ) : (
              <div className="flex w-full h-[350px] md:h-[400px] lg:h-full items-center justify-center">
                <NoData />
              </div>
            )}
          </motion.div>
        </>
      ) : (
        <div className="flex w-full h-[350px] md:h-[400px] lg:h-full items-center justify-center">
          <MyLoader />
        </div>
      )}
      {warning && (
        <WarningPopup
          name="product"
          itemId={onDeleteId}
          onClose={() => setWarning(false)}
          onDelete={(id) => handleDelete(id)}
        />
      )}
    </motion.div>
  );
};

export default MainCategory;
