import React, { useState, useEffect } from "react";
import { Search, Menu, Plus } from "lucide-react";
import ProductCard from "./productCard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  getProducts,
  deleteProduct,
  getSupermarkets,
  getCategoriesFromFirebase,
} from "../utils/firebasefunctions";
import WarningPopup from "../popup/warning";
import { toast } from "react-toastify";

const MainProucts = () => {
  const [search, setSearch] = useState("");

  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("category");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSupermarkets, setSelectedSupermarkets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [supermarkets, setSupermarkets] = useState([]);
  const [warning, setWarning] = useState(false);
  const [onDeleteId, setOnDeleteId] = useState("");

  const fetchData = async () => {
    const data = await getProducts();
    setProduct(data);
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategoriesFromFirebase();
      setCategories(data);
    } catch (error) {
      // toast.error("Error fetching categories");
    }
  };

  const fetchSupermarkets = async () => {
    try {
      const data = await getSupermarkets();
      setSupermarkets(data);
    } catch (error) {
      // toast.error("Error fetching supermarkets");
    }
  };

  const openConfirmPopup = (id) => {
    setOnDeleteId(id)
    setWarning(true);
  }

  useEffect(() => {
    fetchCategories();
    fetchSupermarkets();
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setWarning(false);
    toast.success("Supermarket Delete Successfully");
    fetchData();
  };

  const filteredProduct = product.filter((product) =>
    product.productName.toLowerCase().includes(search.toLowerCase())
  );

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

            {/* Filter Button */}
            <div className="relative">
              <button
                className="border rounded-full px-4 py-2 flex items-center font-HelveticaNeueRegular text-darkColor bg-gray-200 hover:bg-gray-300"
                onClick={() => setIsOpen(!isOpen)}
              >
                <p className="text-sm pr-3">Filters</p>
                <Menu className="h-4 w-4" />
              </button>

              {/* Dropdown */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-50">
                  {/* Tabs */}
                  <div className="flex border-b">
                    <button
                      className={`w-1/2 py-2 text-center ${
                        activeTab === "category" ? "bg-gray-200 font-bold" : ""
                      }`}
                      onClick={() => setActiveTab("category")}
                    >
                      Categories
                    </button>
                    <button
                      className={`w-1/2 py-2 text-center ${
                        activeTab === "supermarket"
                          ? "bg-gray-200 font-bold"
                          : ""
                      }`}
                      onClick={() => setActiveTab("supermarket")}
                    >
                      Supermarkets
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="p-3">
                    {activeTab === "category" ? (
                      <ul>
                        {categories.map((category, i) => (
                          <li key={i} className="flex items-center gap-2 py-1">
                            <input
                              type="checkbox"
                              className="w-4 h-4"
                              checked={selectedCategories.includes(
                                category.name
                              )}
                              onChange={() =>
                                setSelectedCategories((prev) =>
                                  prev.includes(category.name)
                                    ? prev.filter(
                                        (item) => item !== category.name
                                      )
                                    : [...prev, category.name]
                                )
                              }
                            />
                            <label className="cursor-pointer">
                              {category.name}
                            </label>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul>
                        {supermarkets.map((supermarket) => (
                          <li
                            key={supermarket.id}
                            className="flex items-center gap-2 py-1"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4"
                              checked={selectedSupermarkets.includes(
                                supermarket.supermarketName
                              )}
                              onChange={() =>
                                setSelectedSupermarkets((prev) =>
                                  prev.includes(supermarket.supermarketName)
                                    ? prev.filter(
                                        (item) =>
                                          item !== supermarket.supermarketName
                                      )
                                    : [...prev, supermarket.supermarketName]
                                )
                              }
                            />
                            <label className="cursor-pointer">
                              {supermarket.supermarketName}
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-between p-3 border-t">
                    <button
                      className="text-sm text-gray-600 hover:underline"
                      onClick={() => {
                        setSelectedCategories([]);
                        setSelectedSupermarkets([]);
                      }}
                    >
                      Clear
                    </button>
                    <button
                      className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-700"
                      onClick={() => {
                        console.log("Selected Categories:", selectedCategories);
                        console.log(
                          "Selected Supermarkets:",
                          selectedSupermarkets
                        );
                        setIsOpen(false);
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Add Product Button */}
            <button className="border hidden rounded-full px-4 w-full py-2 md:flex items-center font-HelveticaNeueRegular text-white bg-gkRedColor hover:bg-gkRedColor/90">
              <p className="text-sm pr-3">Add New Product</p>
            </button>
          </div>
        </div>
      </div>

      {/* Cards Section with Staggered Animation */}
      <motion.div
        className="flex flex-wrap gap-3 lg:h-[88%] lg:overflow-y-scroll panelScroll pb-3"
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
        {filteredProduct.length > 0 ? (
          filteredProduct.map((item, index) => (
            <motion.div
              key={index}
              className="w-[49%] md:w-[32%] xl:w-[23%]"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <ProductCard data={item} onDelete={() => openConfirmPopup(item.id)} />
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 w-full mt-10">
            No data found
          </p>
        )}
      </motion.div>
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

export default MainProucts;
