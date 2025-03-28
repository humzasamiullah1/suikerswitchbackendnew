import React, { useState, useEffect } from "react";
import { Search, Menu, Plus } from "lucide-react";
import ProductCard from "./productCard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import {
  getProducts,
  deleteProduct,
  getSupermarkets,
  getCategoriesFromFirebase,
} from "../utils/firebasefunctions";
import WarningPopup from "../popup/warning";
import { toast } from "react-toastify";
import NoData from "../reuseable/noData";
import MyLoader from "../reuseable/myLoader";

const MainProucts = () => {
  const [search, setSearch] = useState("");
  const [product, setProduct] = useState([]);
  const [productCache, setProductCache] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("category");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSupermarkets, setSelectedSupermarkets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [supermarkets, setSupermarkets] = useState([]);
  const [warning, setWarning] = useState(false);
  const [onDeleteId, setOnDeleteId] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 30;

  useEffect(() => {
    fetchData();
    fetchCategories();
    fetchSupermarkets();
  }, []);

  const fetchData = async () => {
    const data = await getProducts();
    setProduct(data);
    setProductCache(data);
    setFilteredProduct(data);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const data = await getCategoriesFromFirebase();
    setCategories(data);
  };

  const fetchSupermarkets = async () => {
    const data = await getSupermarkets();
    setSupermarkets(data);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setWarning(false);
    toast.success("Product Deleted Successfully");
    fetchData();
  };

  // Filtering logic
  const handleFilter = () => {
    let filtered = productCache;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        item.selectedCategories.some((category) =>
          selectedCategories.includes(category)
        )
      );
    }

    if (selectedSupermarkets.length > 0) {
      filtered = filtered.filter((item) =>
        item.selectedSupermarkets.some((supermarket) =>
          selectedSupermarkets.includes(supermarket)
        )
      );
    }

    setFilteredProduct(filtered);
    setCurrentPage(0); // Reset pagination after filtering
  };

  // Search filter
  const searchedProducts = filteredProduct.filter((p) =>
    p.productName.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Logic
  const pageCount = Math.ceil(searchedProducts.length / productsPerPage);
  const currentProducts = searchedProducts.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

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
            All Products
          </p>
          <Link to={"/dashboard/add-product"}>
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
                <div className="absolute right-[-60px] mt-2 w-72 bg-white border rounded-lg shadow-lg z-50">
                  {/* Tabs */}
                  <div className="flex border-b">
                    <button
                      className={`w-1/2 py-2 text-sm text-center font-HelveticaNeueMedium ${
                        activeTab === "category" ? "bg-gray-200" : ""
                      }`}
                      onClick={() => setActiveTab("category")}
                    >
                      Categories
                    </button>
                    <button
                      className={`w-1/2 py-2 text-sm text-center font-HelveticaNeueMedium ${
                        activeTab === "supermarket" ? "bg-gray-200" : ""
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
                          <li
                            key={i}
                            className="flex items-center text-[15px] font-HelveticaNeueRegular gap-2 py-1"
                          >
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
                            className="flex items-center gap-2 text-[15px] font-HelveticaNeueRegular py-1"
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
                      className="text-sm text-gray-600 font-HelveticaNeueMedium hover:underline"
                      onClick={() => {
                        setSelectedCategories([]);
                        setSelectedSupermarkets([]);
                        setProduct(productCache);
                      }}
                    >
                      Clear
                    </button>
                    <button
                      className="bg-gkRedColor text-white px-4 py-1 rounded-lg text-sm font-HelveticaNeueMedium hover:bg-gkRedColor/90"
                      onClick={() => {
                        handleFilter();
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
            <Link to={"/dashboard/add-product"}>
              <button className="border hidden rounded-full px-4 w-full py-2 md:flex items-center font-HelveticaNeueRegular text-white bg-gkRedColor hover:bg-gkRedColor/90">
                <p className="text-sm pr-3">Add New Product</p>
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
            {currentProducts.length > 0 ? (
              currentProducts.map((item, index) => (
                <motion.div
                  key={index}
                  className="w-[49%] md:w-[32%] xl:w-[23%]"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <ProductCard
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
          {/* Pagination Controls */}
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

export default MainProucts;
