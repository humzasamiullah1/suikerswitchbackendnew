import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  getCategoriesFromFirebase,
  getSupermarkets,
  addProductToFirebase,
} from "../utils/firebasefunctions";
import { toast } from "react-toastify";
import { Plus, X } from "lucide-react";

const FormSection = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [supermarkets, setSupermarkets] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSupermarkets, setSelectedSupermarkets] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchSupermarkets();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategoriesFromFirebase();
      setCategories(
        data.map((category) => ({ label: category.name, value: category.name }))
      );
    } catch (error) {
      toast.error("Error fetching categories");
    }
  };

  const fetchSupermarkets = async () => {
    try {
      const data = await getSupermarkets();
      setSupermarkets(
        data.map((sup) => ({
          label: sup.supermarketName,
          value: sup.supermarketName,
        }))
      );
    } catch (error) {
      toast.error("Error fetching supermarkets");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage({ file, preview: URL.createObjectURL(file) });
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      !productName ||
      !productPrice ||
      selectedCategories.length === 0 ||
      selectedSupermarkets.length === 0
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const productData = {
      productName,
      productPrice,
      selectedCategories: selectedCategories.map((cat) => cat.value),
      selectedSupermarkets: selectedSupermarkets.map((sup) => sup.value),
    };

    await addProductToFirebase(productData, image ? [image.file] : []);
    toast.success("Product added successfully!");

    setProductName("");
    setProductPrice("");
    setSelectedCategories([]);
    setSelectedSupermarkets([]);
    setImage(null);
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-2 border-gray-100 rounded-2xl w-full px-3 py-4 mt-3"
    >
      {/* ✅ Image Upload */}
      <div className="px-2 pt-2">
        <h2 className="text-lg font-medium pb-2">Image</h2>
        <div className="flex space-x-2">
          {image ? (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
              <img
                src={image.preview}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-200"
              >
                <X size={16} className="text-red-500" />
              </button>
            </div>
          ) : (
            <label className="w-20 h-20 flex items-center justify-center bg-red-100 text-red-500 rounded-lg cursor-pointer">
              <Plus size={24} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
      </div>

      {/* ✅ Product Name & Price */}
      <div className="flex flex-col md:flex-row justify-between pt-5">
        <div className="w-full md:w-[49%]">
          <label className="text-sm">Product Name</label>
          <input
            type="text"
            placeholder="Enter product name"
            className="w-full mt-1 text-sm rounded-md bg-gray-100 px-3 py-2 text-gray-700"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div className="w-full md:w-[49%] pt-4 md:pt-0">
          <label className="text-sm">Product Price</label>
          <input
            type="text"
            placeholder="Enter product price"
            className="w-full mt-1 text-sm rounded-md bg-gray-100 px-3 py-2 text-gray-700"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between pt-5">
        {/* ✅ Multi-Select Dropdown - Supermarkets */}
        <div className="w-full md:w-[49%] pt-4 md:pt-0">
          <label className="text-sm">Select Supermarkets</label>
          <Select
            isMulti
            options={supermarkets}
            value={selectedSupermarkets}
            onChange={setSelectedSupermarkets}
            className="mt-1"
          />
        </div>

        {/* ✅ Multi-Select Dropdown - Categories */}
        <div className="w-full md:w-[49%] pt-4 md:pt-0">
          <label className="text-sm">Select Categories</label>
          <Select
            isMulti
            options={categories}
            value={selectedCategories}
            onChange={setSelectedCategories}
            className="mt-1 w-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-7">
        <button className="border text-xs rounded-full px-8 py-2 flex items-center font-HelveticaNeueMedium text-darkColor bg-gray-200 hover:bg-gray-200">
          Cancel
        </button>
        <button disabled={loading} type="submit" className="border text-xs w-[15%] justify-center rounded-full px-4 py-2 flex items-center font-HelveticaNeueMedium text-white bg-gkRedColor hover:bg-gkRedColor/90">
          <span>Proceed</span>
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
    </form>
  );
};

export default FormSection;
