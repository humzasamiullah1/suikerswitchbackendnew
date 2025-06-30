import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronLeft, ChevronRight, CircleX } from "lucide-react";
import {
  getProducts,
  getSupermarkets,
  getRecipe,
  getBlogs,
} from "../utils/firebasefunctions";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../Products/productCard";
import Card from "../supermarkets/card";
import RecipiesCard from "../Recipies/recipiesCard";
import BlogCard from "../Blogs/blogCard";

const MainSearch = ({ onEmptyBlur }) => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSuperIndex, setCurrentSuperIndex] = useState(0);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0);
  const [supermarkets, setSupermarkets] = useState([]);
  const [recipeData, setRecipeData] = useState([]);
  const [blogsData, setBlogsData] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [filteredSupermarkets, setFilteredSupermarkets] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const inputRef = useRef(null);

  const fetchData = async () => {
    const data = await getProducts();
    setProducts(data);
    setFilteredProducts(data);
  };

  const fetchBlogData = async () => {
    const data = await getBlogs();
    setBlogsData(data);
    setFilteredBlogs(data);
  };

  const fetchSuperMarketData = async () => {
    const data = await getSupermarkets();
    setSupermarkets(data);
    setFilteredSupermarkets(data);
  };

  const fetchRecipeData = async () => {
    const data = await getRecipe();
    setRecipeData(data);
    setFilteredRecipes(data);
  };

  useEffect(() => {
    fetchData();
    fetchSuperMarketData();
    fetchRecipeData();
    fetchBlogData();
    inputRef.current.focus();
  }, []);

  // Number of items to display per slide
  const itemsPerSlide = 4;

  const handleNext = () => {
    if (currentIndex + itemsPerSlide < products.length) {
      setCurrentIndex(currentIndex + itemsPerSlide);
    }
  };

  const handlePrev = () => {
    if (currentIndex - itemsPerSlide >= 0) {
      setCurrentIndex(currentIndex - itemsPerSlide);
    }
  };

  const itemsSuperPerSlide = 4;

  const handleSuperNext = () => {
    if (currentSuperIndex + itemsSuperPerSlide < supermarkets.length) {
      setCurrentSuperIndex(currentSuperIndex + itemsSuperPerSlide);
    }
  };

  const handleSuperPrev = () => {
    if (currentSuperIndex - itemsSuperPerSlide >= 0) {
      setCurrentSuperIndex(currentSuperIndex - itemsSuperPerSlide);
    }
  };

  const itemsRecipePerSlide = 4;

  const handleRecipeNext = () => {
    if (currentRecipeIndex + itemsRecipePerSlide < recipeData.length) {
      setCurrentRecipeIndex(currentRecipeIndex + itemsRecipePerSlide);
    }
  };

  const handleRecipePrev = () => {
    if (currentRecipeIndex - itemsRecipePerSlide >= 0) {
      setCurrentRecipeIndex(currentRecipeIndex - itemsRecipePerSlide);
    }
  };

  const itemsBlogPerSlide = 4;

  const handleBlogeNext = () => {
    if (currentBlogIndex + itemsBlogPerSlide < blogsData.length) {
      setCurrentBlogIndex(currentBlogIndex + itemsBlogPerSlide);
    }
  };

  const handleBlogPrev = () => {
    if (currentBlogIndex - itemsBlogPerSlide >= 0) {
      setCurrentBlogIndex(currentBlogIndex - itemsBlogPerSlide);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredProducts(products);
      setFilteredSupermarkets(supermarkets);
      setFilteredRecipes(recipeData);
      setFilteredBlogs(blogsData);
      return;
    }

    const lowerValue = value?.toLowerCase();
    setFilteredProducts(
      products.filter((p) => p?.productName?.toLowerCase().includes(lowerValue))
    );
    setFilteredBlogs(
      blogsData.filter(
        (b) =>
          b.description.toLowerCase().includes(lowerValue) ||
          b.content.toLowerCase().includes(lowerValue)
      )
    );
    setFilteredSupermarkets(
      supermarkets.filter(
        (s) =>
          s.supermarketName.toLowerCase().includes(lowerValue) ||
          s.description.toLowerCase().includes(lowerValue)
      )
    );
    setFilteredRecipes(
      recipeData.filter(
        (r) =>
          r.description.toLowerCase().includes(lowerValue) ||
          r.content.toLowerCase().includes(lowerValue)
      )
    );
  };

  const handleClose = () => {
    onEmptyBlur(false);
  };

  return (
    <div>
      <div className="flex w-full justify-end pt-7">
        <CircleX className="cursor-pointer" onClick={handleClose}/>
      </div>
      {/* Search Input */}
      <div className="relative mx-auto mt-16 w-[69%] sm:w-[82%] md:w-[84%] lg:w-[69%] xl:w-[78%] 2xl:w-[79%]">
        <input
          type="text"
          ref={inputRef}
          placeholder="Search"
          className="w-full font-HelveticaNeueRegular mt-1 bg-white py-3 text-sm rounded-full text-darkColor placeholder:text-zinc-700/50"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="absolute top-[6px] right-[3px] bg-gkRedColor rounded-full size-10 flex justify-center items-center">
          <Search color="#FFFF" size={18} />
        </div>
      </div>
      <div className="mt-12 w-full">
        {/* Products Section */}
        {filteredProducts.length > 0 && (
          <div>
            <p className="font-HelveticaNeueMedium text-darkColor text-lg">
              Products
            </p>

            <div className="relative w-full overflow-hidden">
              {/* Navigation Buttons */}
              <button
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 ${currentIndex === 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 cursor-pointer'} bg-gray-300 p-2 rounded-full z-10`}
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 ${currentIndex + itemsPerSlide >= filteredProducts.length ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 cursor-pointer'} bg-gray-300 p-2 rounded-full z-10`}
                onClick={handleNext}
                disabled={
                  currentIndex + itemsPerSlide >= filteredProducts.length
                }
              >
                <ChevronRight size={24} />
              </button>

              {/* Carousel Content */}
              <div className="flex w-full overflow-hidden justify-center items-center">
                <AnimatePresence>
                  {filteredProducts
                    .slice(currentIndex, currentIndex + itemsPerSlide)
                    .map((item, index) => (
                      <motion.div
                        key={index}
                        className="w-full lg:w-[23%] mx-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <ProductCard
                          data={item}
                          highlightSearchTerm={searchTerm}
                        />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* Super market Section */}
        {filteredSupermarkets.length > 0 && (
          <div>
            <p className="font-HelveticaNeueMedium text-darkColor text-lg mt-5">
              SuperMarket
            </p>

            <div className="relative w-full overflow-hidden">
              {/* Navigation Buttons */}
              <button
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 ${currentSuperIndex === 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 cursor-pointer'} p-2 rounded-full z-10`}
                onClick={handleSuperPrev}
                disabled={currentSuperIndex === 0}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 ${currentSuperIndex + itemsSuperPerSlide >= filteredSupermarkets.length ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 cursor-pointer'} p-2 rounded-full z-10`}
                onClick={handleSuperNext}
                disabled={
                  currentSuperIndex + itemsSuperPerSlide >= filteredSupermarkets.length
                }
              >
                <ChevronRight size={24} />
              </button>

              {/* Carousel Content */}
              <div className="flex w-full overflow-hidden justify-center items-center">
                <AnimatePresence>
                  {filteredSupermarkets
                    .slice(currentSuperIndex, currentSuperIndex + itemsSuperPerSlide)
                    .map((item, index) => (
                      <motion.div
                        key={index}
                        className="w-[23%] mx-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Card data={item} highlightSearchTerm={searchTerm} />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* Recipe Section */}
        {filteredRecipes.length > 0 && (
          <div>
            <p className="font-HelveticaNeueMedium text-darkColor text-lg mt-5">
              Recipe
            </p>

            <div className="relative w-full overflow-hidden">
              {/* Navigation Buttons */}
              <button
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 ${currentRecipeIndex === 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 cursor-pointer'} p-2 rounded-full z-10`}
                onClick={handleRecipePrev}
                disabled={currentRecipeIndex === 0}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 ${currentRecipeIndex + itemsRecipePerSlide >= filteredRecipes.length ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 cursor-pointer'} p-2 rounded-full z-10`}
                onClick={handleRecipeNext}
                disabled={
                  currentRecipeIndex + itemsRecipePerSlide >= filteredRecipes.length
                }
              >
                <ChevronRight size={24} />
              </button>

              {/* Carousel Content */}
              <div className="flex w-full overflow-hidden justify-center items-center">
                <AnimatePresence>
                  {filteredRecipes
                    .slice(currentRecipeIndex, currentRecipeIndex + itemsRecipePerSlide)
                    .map((item, index) => (
                      <motion.div
                        key={index}
                        className="w-[33%] mx-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <RecipiesCard data={item} highlightSearchTerm={searchTerm}/>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* Recipe Section */}
        {filteredBlogs.length > 0 && (
          <div>
            <p className="font-HelveticaNeueMedium text-darkColor text-lg mt-5">
              Blogs
            </p>

            <div className="relative w-full overflow-hidden">
              {/* Navigation Buttons */}
              <button
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 ${currentBlogIndex === 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 cursor-pointer'}  p-2 rounded-full z-10`}
                onClick={handleBlogPrev}
                disabled={currentBlogIndex === 0}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 ${currentBlogIndex + itemsBlogPerSlide >= filteredBlogs.length ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300 cursor-pointer'} p-2 rounded-full z-10`}
                onClick={handleBlogeNext}
                disabled={currentBlogIndex + itemsBlogPerSlide >= filteredBlogs.length}
              >
                <ChevronRight size={24} />
              </button>

              {/* Carousel Content */}
              <div className="flex w-full overflow-hidden justify-center items-center">
                <AnimatePresence>
                  {filteredBlogs
                    .slice(currentBlogIndex, currentBlogIndex + itemsBlogPerSlide)
                    .map((item, index) => (
                      <motion.div
                        key={index}
                        className="w-[33%] mx-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <BlogCard
                          data={item}
                          highlightSearchTerm={searchTerm}
                        />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainSearch;
