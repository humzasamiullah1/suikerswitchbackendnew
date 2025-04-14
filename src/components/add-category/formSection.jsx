import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Plus, X, Trash2, PlusCircle } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  addCategoryToFirebase,
  updateCategoryToFirebase,
  getCategoryById,
} from "../utils/firebasefunctions";

const FormSection = () => {
  const [images, setImages] = useState([]);
  const [searchParams] = useSearchParams();
  const [imageFiles, setImageFiles] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [isCheckCategory, setIsCheckCategory] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const id = searchParams.get("id");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));

    setImages([...imageUrls]); // Replace existing image
    setImageFiles([...files]); // Replace image file
  };

  useEffect(() => {
    if (id) {
      fetchCategoryDetails(id);
    }
  }, []);

  const fetchCategoryDetails = async (productId) => {
    try {
      const category = await getCategoryById(productId);
      if (category) {
        setCategoryName(category.categoryName);
        setSubCategories(category.subCategory);
        setImages(category.images || []);
      }
    } catch (error) {
      toast.error("Error fetching category details");
    }
  };

  const removeImage = () => {
    setImages([]);
    setImageFiles([]);
  };

  const handleSubCategoryChange = (event, index) => {
    const newCategories = [...subCategories];
    newCategories[index].name = event.target.value;
    setSubCategories(newCategories);
  };

  // ✅ Naya category input field add karne ka function
  const addSubCategory = () => {
    setSubCategories([...subCategories, { name: "" }]);
  };

  const deleteSubCategory = async (index) => {
    // const category = categories[index];

    // ✅ Frontend se category remove karein
    const newCategories = subCategories.filter((_, i) => i !== index);
    setSubCategories(newCategories);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (categoryName === "") {
      toast.error("Product Name is required");
      setIsCheckCategory(true);
      return;
    }

    setIsCheckCategory(false);
    setLoading(true);

    const categoryData = {
      categoryName,
      timestamp: Date.now(),
      subCategory: subCategories,
      images,
    };

    console.log(categoryData);



    try {
      if (id) {

        // ✅ Update existing product
        await updateCategoryToFirebase(id, categoryData, imageFiles);
        toast.success("Category updated successfully!");
        setTimeout(() => {
          navigate("/dashboard/category");
        }, 1000);
      } else {

        // ✅ Add new product
        await addCategoryToFirebase(categoryData, imageFiles);
        toast.success("Category added successfully!");
        setCategoryName("");
        setImages([]);
        setImageFiles([]);
        setTimeout(() => {
          navigate("/dashboard/category");
        }, 1000);
      }
    } catch (error) {
      toast.error("Error processing request");
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-2 border-gray-100 rounded-2xl w-full px-3 py-4 mt-3"
    >
      <div className="px-2 pt-2">
        <h2 className="text-base font-HelveticaNeueMedium pb-2">
          {/* {id ? "Update Category" : "Upload Logo"} */}
          Upload Image
        </h2>
        <div className="flex space-x-2">
          {images.length > 0 ? (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
              <img
                src={images[0]}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                onClick={removeImage}
              >
                <X size={16} />
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
      <div className="pt-5">
        <label className="text-sm">Category Name</label>
        <input
          type="text"
          placeholder="Enter category name"
          className={`w-full ${
            isCheckCategory ? "border-2 border-red-600" : ""
          } mt-1 text-sm rounded-md bg-gray-100 px-3 py-2 text-gray-700`}
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </div>
      <div className="pt-5">
        {subCategories.map((item, index) => (
          <div key={index} className="flex items-center mb-3 w-full">
            <input
              type="text"
              placeholder="Enter Sub Category"
              value={item.name}
              onChange={(event) => handleSubCategoryChange(event, index)}
              className="px-4 py-2 bg-gray-50 !border-2 !border-gray-100 rounded-lg flex-1 focus:outline-none"
            />
            <Trash2
              onClick={() => deleteSubCategory(index)}
              className="ml-2 text-red-500 cursor-pointer hover:text-red-600"
            />
          </div>
        ))}
        <div
          onClick={addSubCategory}
          className="flex flex-col items-center justify-center py-2 text-blue-500 cursor-pointer hover:text-blue-600"
        >
          <PlusCircle size={45} className=" text-gkRedColor" />
          <span className="font-HelveticaNeueMedium text-darkColor">
            Add Sub Category
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-7">
        <Link to="/dashboard/category">
          <button
            type="button"
            className="border text-xs rounded-full px-8 py-2 bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
        </Link>
        <button
          disabled={loading}
          type="submit"
          className="border text-xs rounded-full px-4 py-2 flex items-center font-HelveticaNeueMedium text-white bg-gkRedColor hover:bg-gkRedColor/90"
        >
          {id ? "Update" : "Proceed"}
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
