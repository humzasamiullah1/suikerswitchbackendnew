import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom"; // ✅ Import useRouter for query params
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import Select from "react-select";
import { serverTimestamp } from "firebase/firestore";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  uploadImageToBlogFirebase,
  getCategoriesFromFirebase,
  getSupermarkets,
  addProductToFirebase,
  getProductById, // ✅ New function to get product by ID
  updateProductToFirebase, // ✅ New function to update product
} from "../utils/firebasefunctions";
import { toast } from "react-toastify";
import { Plus, X } from "lucide-react";

const FormSection = () => {
  const [content, setContent] = useState("");
  const [searchParams] = useSearchParams();
  const [productName, setProductName] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [supermarkets, setSupermarkets] = useState([]);
  const [ingredients, setingredients] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedSupermarkets, setSelectedSupermarkets] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCheckName, setIsCheckName] = useState(false);
  const [isChecCat, setIsCheckCat] = useState(false);
  const [isChecSuperMarket, setIsCheckSuperMarket] = useState(false);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [isCheckDesc, setIsCheckDesc] = useState(false);
  const [loadingRichText, setLoadingRichText] = useState(false);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [allCategory, setallCategory] = useState([]);
  const navigate = useNavigate();

  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      fetchProductDetails(id); // ✅ Fetch product if editing
    } else {
      fetchCategories(null);
      fetchSupermarkets(null);
    }
  }, [id]);

  const fetchCategories = async (product) => {
    try {
      const data = await getCategoriesFromFirebase();
      setallCategory(data)
      if (product) {
        setSelectedCategories(
          product.selectedCategories.map((cat) => ({ label: cat, value: cat }))
        );
        setSelectedSubCategories(product.selectedSubCategories.map((sub) => ({ label: sub, value: sub })))
      }
      setCategories(
        data.map((category) => ({
          label: category.categoryName,
          value: category.categoryName,
        }))
      );
      // for (let i = 0; data.selectedSubCategories.length > ; i++) {
        // setSubCategoryOptions(
        //   data.selectedSubCategories.map((subcategory) => ({
        //     label: subcategory,
        //     value: subcategory,
        //   }))
        // );
      // }
    } catch (error) {
      toast.error("Error fetching categories");
    }
  };

  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [isLoad, setIsLoad] = useState(true);

  const handleCategoryChange = (selected) => {
    setIsLoad(true);
    setSelectedCategories(selected || []);
    setSelectedSubCategories([]);
    setSubCategoryOptions([])
    // const data = [];

    if (selected && selected.length > 0) {
      const data = selected.flatMap((sel) => {
        const matchData = allCategory.find((x) => x.categoryName === sel.label);
        return matchData?.subCategory?.map((sub) => ({
          label: sub.name,
          value: sub.name,
        })) || [];
      });
    
      setSubCategoryOptions(data); 
      setIsLoad(false);
    } else {
      setSubCategoryOptions([]);
      setIsLoad(false);
    }
  };

  const fetchSupermarkets = async (product) => {
    try {
      const data = await getSupermarkets();
      if (product) {
        setSelectedSupermarkets(
          product.selectedSupermarkets.map((sup) => ({
            label: sup,
            value: sup,
          }))
        );
      }
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

  // ✅ Fetch Product Details when editing
  const fetchProductDetails = async (productId) => {
    try {
      const product = await getProductById(productId);
      if (product) {
        fetchCategories(product);
        fetchSupermarkets(product);

        setProductName(product.productName);
        setDescription(product.description);
        setingredients(product?.ingredients);
        setContent(product.content);
        setImages(product.images || []);
      }
    } catch (error) {
      toast.error("Error fetching product details");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));

    setImages([...imageUrls]); // Replace existing image
    setImageFiles([...files]); // Replace image file
  };

  const removeImage = () => {
    setImages([]);
    setImageFiles([]);
  };

  const handleImageUpload = async (file, info, uploadHandler) => {
    setLoadingRichText(true);
    try {
      const imageUrl = await uploadImageToBlogFirebase(file, "blogImages");
      if (imageUrl) {
        uploadHandler({
          result: [{ url: imageUrl, name: file.name }],
        });

        // ✅ Remove base64 image & insert Firebase URL
        setContent((prevContent) =>
          prevContent.replace(
            /<img[^>]+src=["'](data:image\/[^"']+)["']/g,
            `<img src="${imageUrl}"`
          )
        );
        setLoadingRichText(false);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      uploadHandler({ errorMessage: "Image upload failed!" });
      setLoadingRichText(false);
    }
  };

  // const handleingredientChange = (event, index) => {
  //   const newingredients = [...ingredients];
  //   newingredients[index] = event.target.value;
  //   setingredients(newingredients);
  // };

  // const addIngredient = () => {
  //   setingredients([...ingredients, ""]);
  // };

  // const deleteIngredient = async (index) => {
  //   // ✅ Frontend se category remove karein
  //   const newingredients = ingredients.filter((_, i) => i !== index);
  //   setingredients(newingredients);
  // };

  // ✅ Handle Create or Update Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (productName === "") {
      toast.error("Product Name is required");
      setIsCheckName(true);
      return;
    } else if (description === "") {
      toast.error("Description is required");
      setIsCheckDesc(true);
      return;
    } else if (selectedCategories.length === 0) {
      toast.error("Categories are required");
      setIsCheckCat(true);
      // setIsCheckName(false)
      return;
    } else if (selectedSupermarkets.length === 0) {
      toast.error("Supermarkets are required");
      setIsCheckSuperMarket(true);
      // setIsCheckCat(false)
      // setIsCheckName(false)
      return;
    } else if (ingredients.length === 0) {
      toast.error("Ingredients are required");

      // setIsCheckCat(false)
      // setIsCheckName(false)
      return;
    }

    setIsCheckName(false);
    setIsCheckCat(false);
    setIsCheckSuperMarket(false);
    setLoading(true);

    const productData = {
      productName,
      description,
      content,
      selectedCategories: selectedCategories.map((cat) => cat.value),
      selectedSupermarkets: selectedSupermarkets.map((sup) => sup.value),
      selectedSubCategories: selectedSubCategories.map((sub) => sub.value),
      ingredients: ingredients,
      timestamp: Date.now(),
      images,
    };

    try {
      if (id) {
        // ✅ Update existing product
        await updateProductToFirebase(id, productData, imageFiles);
        toast.success("Product updated successfully!");
        setTimeout(() => {
          navigate("/dashboard/products");
        }, 1000);
      } else {
        // ✅ Add new product
        await addProductToFirebase(productData, imageFiles);
        toast.success("Product added successfully!");
        setProductName("");
        setSelectedCategories([]);
        setSelectedSupermarkets([]);
        setingredients("");
        setImage(null);
        setImages([]);
        setImageFiles([]);
        setTimeout(() => {
          navigate("/dashboard/products");
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
      {/* ✅ Image Upload */}
      <div className="px-2 pt-2">
        <h2 className="text-base font-HelveticaNeueMedium pb-2">
          {id ? "Update Supermarket" : "Upload Logo"}
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

      {/* ✅ Product Name */}
      <div className="pt-5">
        <label className="text-sm">Product Name</label>
        <input
          type="text"
          placeholder="Enter product name"
          className={`w-full ${
            isCheckName ? "border-2 border-red-600" : ""
          } mt-1 text-sm rounded-md bg-gray-100 px-3 py-2 text-gray-700`}
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>

      {/* ✅ Supermarkets & Categories */}
      <div className="flex flex-col md:flex-row justify-between pt-5">
        <div className="w-full md:w-[32%]">
          <label className="text-sm">Select Supermarkets</label>
          <Select
            isMulti
            options={supermarkets}
            value={selectedSupermarkets}
            onChange={setSelectedSupermarkets}
            className={`mt-1 ${
              isChecSuperMarket ? "border-2 border-red-600" : ""
            }`}
          />
        </div>
        <div className="w-full md:w-[32%] pt-4 md:pt-0">
          <label className="text-sm">Select Categories</label>
          <Select
            isMulti
            options={categories}
            value={selectedCategories}
            onChange={handleCategoryChange}
            className="mt-1 w-full"
          />
        </div>

        {/* Sub-category Select */}
        {/* {!isLoad && ( */}
          <div className="w-full md:w-[32%] pt-4 md:pt-0">
          
            <label className="text-sm">Select Sub Categories</label>
            <Select
              isMulti
              isDisabled={selectedCategories.length === 0}
              options={subCategoryOptions}
              value={selectedSubCategories}
              onChange={setSelectedSubCategories}
              className="mt-1 w-full"
            />
          </div>
        {/* )} */}
      </div>
      <div className="pt-4 w-full">
        <label className="text-sm">Description</label>
        <textarea
          cols={10}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write Supermarket Description"
          className={`w-full h-40 mt-1 text-sm bg-bgColor font-popinsRegular px-3 py-2 rounded-lg text-darkColor placeholder:text-zinc-700/50 !focus:outline-none ${
            isCheckDesc ? "border-2 border-red-600" : ""
          }`}
        />
      </div>
      <div className="pt-4 w-full">
        <label className="text-sm">Ingredients</label>
        <textarea
          cols={10}
          value={ingredients}
          onChange={(e) => setingredients(e.target.value)}
          placeholder="Write Ingredients"
          className={`w-full h-40 mt-1 text-sm bg-bgColor font-popinsRegular px-3 py-2 rounded-lg text-darkColor placeholder:text-zinc-700/50 !focus:outline-none ${
            isCheckDesc ? "border-2 border-red-600" : ""
          }`}
        />
      </div>
      {/* <div className="mt-[10px]">
        <label className="text-sm ">Ingredients</label>
        <div className="lg:h-[88%] w-full">
          <div className="h-[70%] lg:overflow-y-scroll panelScroll w-full pt-3 ">
            {ingredients.map((item, index) => (
              <div key={index} className="flex items-center mb-3 w-full px-2">
                <input
                  type="text"
                  placeholder="Enter Ingredient"
                  value={item}
                  onChange={(event) => handleingredientChange(event, index)}
                  className="px-4 py-2 bg-gray-50 !border-2 !border-gray-100 rounded-lg flex-1 focus:outline-none"
                />
                <Trash2
                  onClick={() => deleteIngredient(index)}
                  className="ml-2 text-red-500 cursor-pointer hover:text-red-600"
                />
              </div>
            ))}
          </div>
          <div className="h-[30%] flex flex-col items-center justify-center pb-5 lg:pb-0">
            <div
              onClick={addIngredient}
              className="flex flex-col items-center justify-center py-2 text-blue-500 cursor-pointer hover:text-blue-600"
            >
              <PlusCircle size={45} className=" text-gkRedColor" />
              <span className="font-HelveticaNeueMedium text-darkColor">
                Add Ingredient's
              </span>
            </div>
          </div>
        </div>
      </div> */}
      {/* 🔹 Rich Text Editor */}
      {/* <div className="flex-1 h-full overflow-hidden relative pt-5 pb-20">
        {loadingRichText && (
          <main className="w-full h-screen backdrop-blur-sm bg-black/40 absolute inset-0 z-50 flex items-center justify-center">
            <section className="w-[90%] sm:w-[65%] md:w-[50%] lg:w-[40%] xl:w-[30%] bg-texture myshades rounded-[31px] mx-auto">
              <div role="status" className="">
                <svg
                  aria-hidden="true"
                  class="w-24 h-24 text-gray-200 animate-spin dark:text-white fill-gkRedColor"
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
            </section>
          </main>
        )}
        <SunEditor
          setContents={content}
          onChange={setContent}
          placeholder="Write something here..."
          setOptions={{
            minHeight: "100%",
            height: "100%",
            imageUploadUrl: null, // 🔥 Disable default base64 upload
            imageGalleryUrl: null, // 🔥 Disable gallery uploads
            buttonList: [
              ["formatBlock", "bold", "underline", "italic", "strike"],
              ["list", "align", "link", "image", "video"],
              ["fullScreen", "undo", "redo"],
            ],
            formats: [
              "p",
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "blockquote",
              "pre",
            ],
            popupDisplay: "show",
            showPathLabel: false,
            appendToBody: true,
            callBackSave: (content) => setContent(content), // ✅ Ensure content is updated
          }}
          onImageUploadBefore={(files, _, uploadHandler) => {
            handleImageUpload(files[0], {}, uploadHandler);
            return false; // 🔥 Prevent default base64 upload
          }}
          className="h-full"
        />
      </div> */}

      {/* ✅ Submit Button */}
      <div className="flex items-center justify-center gap-2 mt-7">
        <Link to="/dashboard/products">
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
