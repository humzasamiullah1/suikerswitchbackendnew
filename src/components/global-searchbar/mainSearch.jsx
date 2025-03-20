import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts, getSupermarkets, getRecipe } from "../utils/firebasefunctions";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../Products/productCard";
import Card from "../supermarkets/card";
import RecipiesCard from "../Recipies/recipiesCard"

const MainSearch = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [supermarkets, setSupermarkets] = useState([]);
  const [recipeData, setRecipeData] = useState([]);

  const fetchData = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const fetchSuperMarketData = async () => {
    const data = await getSupermarkets();
    setSupermarkets(data);
  };

  const fetchRecipeData = async () => {
    const data = await getRecipe();
    setRecipeData(data);
  };

  useEffect(() => {
    fetchData();
    fetchSuperMarketData();
    fetchRecipeData();
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

  return (
    <div>
      {/* Search Input */}
      <div className="relative mx-auto mt-20 w-[69%] sm:w-[82%] md:w-[84%] lg:w-[69%] xl:w-[78%] 2xl:w-[79%]">
        <input
          type="text"
          placeholder="Search"
          className="w-full font-HelveticaNeueRegular mt-1 bg-white py-3 text-sm rounded-full text-darkColor placeholder:text-zinc-700/50"
        />
        <div className="absolute top-[5px] right-0 bg-gkRedColor rounded-full size-10 flex justify-center items-center">
          <Search color="#FFFF" size={18} />
        </div>
      </div>

      {/* Products Section */}
      <div>
        <p className="font-HelveticaNeueMedium text-darkColor text-lg">
          Products
        </p>

        {products.length > 0 ? (
          <div className="relative w-full overflow-hidden">
            {/* Navigation Buttons */}
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full z-10"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full z-10"
              onClick={handleNext}
              disabled={currentIndex + itemsPerSlide >= products.length}
            >
              <ChevronRight size={24} />
            </button>

            {/* Carousel Content */}
            <div className="flex w-full overflow-hidden justify-center items-center">
              <AnimatePresence>
                {products
                  .slice(currentIndex, currentIndex + itemsPerSlide)
                  .map((item, index) => (
                    <motion.div
                      key={index}
                      className="w-[23%] mx-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ProductCard data={item} />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 w-full mt-10">
            No data found
          </p>
        )}
      </div>

      {/* Super market Section */}
      <div>
        <p className="font-HelveticaNeueMedium text-darkColor text-lg mt-5">
          SuperMarket
        </p>

        {supermarkets.length > 0 ? (
          <div className="relative w-full overflow-hidden">
            {/* Navigation Buttons */}
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full z-10"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full z-10"
              onClick={handleNext}
              disabled={currentIndex + itemsPerSlide >= supermarkets.length}
            >
              <ChevronRight size={24} />
            </button>

            {/* Carousel Content */}
            <div className="flex w-full overflow-hidden justify-center items-center">
              <AnimatePresence>
                {supermarkets
                  .slice(currentIndex, currentIndex + itemsPerSlide)
                  .map((item, index) => (
                    <motion.div
                      key={index}
                      className="w-[23%] mx-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card data={item} />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 w-full mt-10">
            No data found
          </p>
        )}
      </div>

      {/* Recipe Section */}
      <div>
        <p className="font-HelveticaNeueMedium text-darkColor text-lg mt-5">
          Recipe
        </p>

        {recipeData.length > 0 ? (
          <div className="relative w-full overflow-hidden">
            {/* Navigation Buttons */}
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full z-10"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full z-10"
              onClick={handleNext}
              disabled={currentIndex + itemsPerSlide >= recipeData.length}
            >
              <ChevronRight size={24} />
            </button>

            {/* Carousel Content */}
            <div className="flex w-full overflow-hidden justify-center items-center">
              <AnimatePresence>
                {recipeData
                  .slice(currentIndex, currentIndex + itemsPerSlide)
                  .map((item, index) => (
                    <motion.div
                      key={index}
                      className="w-[33%] mx-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <RecipiesCard data={item} />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 w-full mt-10">
            No data found
          </p>
        )}
      </div>
    </div>
  );
};

export default MainSearch;
