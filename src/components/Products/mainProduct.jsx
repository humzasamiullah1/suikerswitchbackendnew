import React, { useState } from "react";
import { Search, Menu, CircleArrowDown, Plus } from "lucide-react";
import ProductCard from "./productCard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MainProucts = () => {
  const [search, setSearch] = useState("");
  const [cardData, setCardData] = useState([
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
    {
      mart: "Daraz Mart",
      title: "Mango Jam 1KG Bucket By Ashifa Foods",
      price: "Rs. 749",
    },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Pehle invisible aur neeche se aayega
      animate={{ opacity: 1, y: 0 }} // Phir smoothly dikhai dega
      transition={{ duration: 0.6, ease: "easeOut" }} // 0.6s ka smooth transition
      className="bg-white rounded-[30px] shadow-md px-5 h-full"
    >
      <div className="flex lg:flex-row flex-col justify-between items-center pt-5 lg:h-[12%]">
        <div className="flex justify-between w-full items-center lg:w-[30%] xl:w-[50%]">
          <p className="font-HelveticaNeueMedium text-darkColor/50 text-lg">
            All Products
          </p>
          <Link to={"/dashboard/add-product"}>
            <div className="bg-gkRedColor md:hidden size-10 rounded-full text-white flex justify-center items-center">
              <Plus size={20} />
            </div>
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
            <button className="border rounded-full px-4 py-2 flex items-center font-HelveticaNeueRegular text-darkColor bg-gray-200 hover:bg-gray-200">
              <p className="text-sm pr-3">Filters</p>
              <Menu className="h-4 w-4" />
            </button>
            <Link to={"/dashboard/add-product"}>
              <button className="border hidden rounded-full px-4 w-full py-2 md:flex items-center font-HelveticaNeueRegular text-white bg-gkRedColor hover:bg-gkRedColor/90">
                <p className="text-sm pr-3">Add New Product</p>
                <CircleArrowDown className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Cards Section with Staggered Animation */}
      <motion.div
        className="flex flex-wrap lg:h-[88%] lg:overflow-y-scroll panelScroll"
        id="gk-cards"
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
        {cardData.map((item, index) => (
          <motion.div
            key={index}
            className="w-full md:w-[32%] xl:w-[23%] md:mr-[2%]"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <ProductCard data={item} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default MainProucts;
