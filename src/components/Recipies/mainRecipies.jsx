import React, { useState, useEffect } from "react";
import { Search, X, CircleArrowDown, Plus } from "lucide-react";
import RecipiesCard from "./recipiesCard";
import LikePopup from "../../components/popup/like";
import CommentsPopup from "../../components/popup/comments";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getRecipe, deleteRecipe } from "../utils/firebasefunctions";
import WarningPopup from "../../components/popup/warning";
import DraggableScrollablePills from "../reuseable/draggable-scrollable-pills";
import NoData from "../reuseable/noData";
import MyLoader from "../reuseable/myLoader";
import { toast } from "react-toastify";

import ReactPaginate from "react-paginate";

const MainRecipies = () => {
  const [search, setSearch] = useState("");
  const [isLikePopup, setIsLikePopup] = useState(false);
  const [isCommentPopup, setIsCommentPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState(false);
  const [onDeleteId, setOnDeleteId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categoryItems = [
    { id: "1", label: "Zoet ontbijt" },
    { id: "2", label: "Hartig ontbijt" },
    { id: "3", label: "Lunch" },
    { id: "4", label: "Diner" },
    { id: "5", label: "Snack" },
    { id: "6", label: "Smoothies" },
    { id: "7", label: "Zoete baksels" },
    { id: "8", label: "Brunch" },
    { id: "9", label: "Feestelijk" },
  ];

  const [recipeData, setRecipeData] = useState([]);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 30;

  const fetchData = async () => {
    const data = await getRecipe();
    setRecipeData(data);
    setLoading(false);
    console.log(recipeData);
  };
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

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

  const openConfirmPopup = (id) => {
    setOnDeleteId(id);
    setWarning(true);
  };

  const handleDelete = async (id) => {
    await deleteRecipe(id);
    setWarning(false);
    toast.success("Blog Deleted Successfully");
    fetchData();
  };

  const searchedProducts = recipeData.filter((recipe) => {
    const matchesSearch =
      recipe.description.toLowerCase().includes(search.toLowerCase()) ||
      recipe.content.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory
      ? recipe.category === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  const pageCount = Math.ceil(searchedProducts.length / productsPerPage);
  const currentProducts = searchedProducts.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleCategory = (item) => {
    setSelectedCategory(item.label)
  }

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
            All Recipes
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
            <Link to={"/dashboard/add-recipies"}>
              <motion.button
                className="border hidden rounded-full px-4 w-full py-2 md:flex items-center font-HelveticaNeueRegular text-white bg-gkRedColor hover:bg-gkRedColor/90"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <p className="text-sm pr-3">Add New Recipes</p>
                <CircleArrowDown className="h-4 w-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex justify-between my-5">
        <div className="w-[85%] sm:w-[90%] md:w-[92%] lg:w-[91%] xl:w-[94%] border border-gray-200 rounded-lg">
          <DraggableScrollablePills
            items={categoryItems}
            onPillClick={(item) => handleCategory(item)}
            isActive={selectedCategory}
          />
        </div>
        {/* </div> */}
        <div className="w-[13%] sm:w-[8%] md:w-[6%] lg:w-[7%] xl:w-[4%]">
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-sm bg-gkRedColor flex justify-center items-center w-full h-full text-white rounded-full"
          >
            <X className="size-5"/>
          </button>
        </div>
      </div>
      {!loading ? (
        <>
          {/* Blog List Section */}
          <div className="lg:h-[78%] lg:overflow-y-scroll panelScroll">
            {currentProducts.length > 0 ? (
              currentProducts.map((item, index) => (
                <motion.div
                  key={index}
                  className="w-[95%] md:w-[85%] lg:w-[75%] mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    delay: index * 0.1,
                  }}
                  viewport={{ once: true }}
                >
                  {/* {item.id}
            <Link to={`/dashboard/blogs-detail/${item.id}`}> */}
                  <RecipiesCard
                    data={item}
                    isShow={true}
                    onLikePopup={opeLikePopup}
                    onCommentPopup={opeCommentsPopup}
                    onDelete={() => openConfirmPopup(item.id)}
                  />
                  {/* </Link> */}
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
      )}
      {warning && (
        <WarningPopup
          name="recipe"
          itemId={onDeleteId}
          onClose={() => setWarning(false)}
          onDelete={(id) => handleDelete(id)}
        />
      )}
      {isLikePopup && <LikePopup onClose={closeLikePopup} />}

      {isCommentPopup && <CommentsPopup onClose={closeCommentsPopup} />}
    </motion.div>
  );
};

export default MainRecipies;
