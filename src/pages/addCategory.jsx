import React, { useEffect, useState } from "react";
import {
  addOrUpdateCategories,
  getCategoriesFromFirebase,
  deleteCategoryFromFirebase,
} from "../components/utils/firebasefunctions";
import { toast } from "react-toastify";
import { PlusCircle, Trash2 } from "lucide-react";
import HeaderBar from "../components/reuseable/headerBar";
import { motion } from "framer-motion";
import MainSearch from '../components/global-searchbar/mainSearch'

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Firebase se categories fetch karne ka function
  const fetchCategories = async () => {
    try {
      const data = await getCategoriesFromFirebase();
      setCategories(data);
    } catch (error) {
      toast.error("Error fetching categories");
    }
  };

  // ✅ Category input change karne ka function
  const handleCategoryChange = (event, index) => {
    const newCategories = [...categories];
    newCategories[index].name = event.target.value;
    setCategories(newCategories);
  };

  // ✅ Naya category input field add karne ka function
  const addCategory = () => {
    setCategories([...categories, { id: null, name: "" }]);
  };

  // ✅ Category ko Firestore mein bulk save/update karne ka function
  const submitCategories = async () => {
    const filteredCategories = categories.filter((c) => c.name.trim() !== "");

    if (filteredCategories.length === 0) {
      toast.warn("Please add at least one category!");
      return;
    }

    setLoading(true);
    try {
      const updatedCategories = await addOrUpdateCategories(filteredCategories);
      setCategories(updatedCategories);
      toast.success("Categories updated successfully!");
    } catch (error) {
      toast.error("Error saving categories");
    }
    setLoading(false);
  };

  // ✅ Category ko Firestore se delete karne ka function
  const deleteCategory = async (index) => {
    const category = categories[index];

    if (category.id) {
      setLoading(true);
      try {
        await deleteCategoryFromFirebase(category.id);
        toast.success("Category deleted successfully!");
      } catch (error) {
        toast.error("Error deleting category");
      }
      setLoading(false);
    }

    // ✅ Frontend se category remove karein
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
  };

  const [isGlobalSearch, setIsGlobalSearch] = useState(false);

  const handleSearch = (value) => {
    setIsGlobalSearch(value);
  };

  const handleGlobalSearch = (value) => {
    setIsGlobalSearch(value)
  }

  return (
    <div className="w-[95%] mx-auto lg:h-screen pt-12 lg:pt-0">
      {!isGlobalSearch ? (
        <>
      <div className="pt-5 w-full lg:h-[15%]">
        <HeaderBar
          heading="Hello, John!"
          subHeading="Explore information and activity about your property"
          handleSearch={(value) => {
            handleSearch(value);
          }}
        />
      </div>
      <div className="h-[85%] pt-5 lg:pt-0">
        <motion.div
          className="bg-white rounded-[30px] shadow-md px-5 h-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex lg:flex-row flex-col justify-between items-center pt-5 lg:h-[12%]">
            <h2 className="text-xl font-HelveticaNeueMedium text-center mb-4">
              Add Categories
            </h2>
          </div>
          <div className="lg:h-[88%] w-full">
            <div className="h-[70%] lg:overflow-y-scroll panelScroll w-full pt-3 px-3">
              {categories.map((item, index) => (
                <div key={index} className="flex items-center mb-3 w-full">
                  <input
                    type="text"
                    placeholder="Enter Category"
                    value={item.name}
                    onChange={(event) => handleCategoryChange(event, index)}
                    className="px-4 py-2 bg-gray-50 !border-2 !border-gray-100 rounded-lg flex-1 focus:outline-none"
                  />
                  <Trash2
                    onClick={() => deleteCategory(index)}
                    className="ml-2 text-red-500 cursor-pointer hover:text-red-600"
                  />
                </div>
              ))}
            </div>
            <div className="h-[30%] flex flex-col items-center justify-center pb-5 lg:pb-0">
              <div
                onClick={addCategory}
                className="flex flex-col items-center justify-center py-2 text-blue-500 cursor-pointer hover:text-blue-600"
              >
                <PlusCircle size={45} className=" text-gkRedColor" />
                <span className="font-HelveticaNeueMedium text-darkColor">
                  Add Category
                </span>
              </div>

              <button
                onClick={submitCategories}
                className="text-base w-[50%] mt-2 justify-center rounded-full py-2 flex items-center font-HelveticaNeueMedium text-white bg-gkRedColor hover:bg-gkRedColor/90"
                disabled={loading}
              >
                <span>Submit</span>
                {loading && (
                  <div role="status" className="pl-3">
                    <svg
                      aria-hidden="true"
                      class="w-5 h-5 text-gray-200 animate-spin dark:text-white fill-gkRedColor"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span class="sr-only">Loading...</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* {loading && <div className="flex justify-center py-3">...Loading</div>} */}
        </motion.div>
      </div>
      </>
      ) : (
        <MainSearch onEmptyBlur={(value) => handleGlobalSearch(value)} />
      )}
    </div>
  );
};

export default AddCategory;
