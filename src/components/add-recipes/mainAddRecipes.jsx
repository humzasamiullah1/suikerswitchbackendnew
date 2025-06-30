import React, { useState, useEffect } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import Select from "react-select";
import {
  uploadImageToRecipeFirebase,
  saveRecipeToFirestore,
  getRecipeById,
  updateRecipe,
} from "../utils/firebasefunctions";
import { useStateValue } from "../../context/StateProvider";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import BreadCrumbs from "../reuseable/breadCrumbs";

import { Plus, X, PlusCircle } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import BulkFormSection from "./BulkFormSection";

const recipeCategory = [
  { label: "Zoet ontbijt", value: "Zoet ontbijt" },
  { label: "Hartig ontbijt", value: "Hartig ontbijt" },
  { label: "Lunch", value: "Lunch" },
  { label: "Diner", value: "Diner" },
  { label: "Snack", value: "Snack" },
  { label: "Smoothies", value: "Smoothies" },
  { label: "Zoete baksels", value: "Zoete baksels" },
  { label: "Brunch", value: "Brunch" },
  { label: "Feestelijk", value: "Feestelijk" },
];

const RichTextEditor = (props) => {
  const [searchParams] = useSearchParams();
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  // const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRichText, setLoadingRichText] = useState(false);
  const [isCheckTitle, setIsCheckTitle] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [category, setCategory] = useState([]);
  const [ingredients, setIngredients] = useState([""]);
  const [tags, settags] = useState([""]);

  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const handletagChange = (index, value) => {
    const updated = [...tags];
    updated[index] = value;
    settags(updated);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const addTags = () => {
    settags([...tags, ""]);
  };

  const deleteIngredient = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
  };

  const deletetags = (index) => {
    const updated = tags.filter((_, i) => i !== index);
    settags(updated);
  };

  const [{ user }] = useStateValue();

  const navigate = useNavigate();

  const id = searchParams.get("id");
  // 🔹 Handle Image Upload in SunEditor
  const handleImageUpload = async (file, info, uploadHandler) => {
    setLoadingRichText(true);
    try {
      const imageUrl = await uploadImageToRecipeFirebase(file, "recipeImages");
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

  useEffect(() => {
    if (id) {
      fetchRecipeData(id);
    }
  }, [id]);

  const fetchRecipeData = async (id) => {
    setLoading(true);
    try {
      const data = await getRecipeById(id);
      if (data) {
        setContent(data.content);
        setDescription(data.description);
        setSelectedCategory(
          data.category.map((sup) => ({
            label: sup,
            value: sup,
          }))
        );
        setImages(data.images || []);
        setIngredients(data.ingredients || [""]);
        settags(data.tags || [""]);
      }
    } catch (error) {
      console.error("Error fetching supermarket data:", error);
    }
    setLoading(false);
  };

  // 🔹 Handle Thumbnail Upload
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

  // 🔹 Handle Post Submission
  const handlePostClick = async () => {
    if (!description.trim()) {
      toast.warning("Title is Required");
      setIsCheckTitle(true);
      return;
    } else if (!content.trim()) {
      toast.warning("Please fill text editor");
      return;
    }

    const hasEmptyIngredient = ingredients.some((ing) => !ing.trim());
    if (hasEmptyIngredient) {
      toast.warning("Please fill in all ingredient fields");
      return;
    }

    setIsCheckTitle(false);
    setLoading(true); // Start Loading
    const recipeData = {
      content,
      description,
      ingredients,
      tags,
      category: selectedCategory.map((sup) => sup.value),
      userId: user?.id || "Unknown",
      userType: user?.usertype || "Guest",
      createdAt: Date.now(),
    };

    try {
      if (id) {
        await updateRecipe(id, recipeData, imageFiles);
        toast.success("Recipe updated successfully!");
        setTimeout(() => {
          navigate("/dashboard/recipies");
        }, 1000);
      } else {
        // ✅ Save Blog to Firestore
        const success = await saveRecipeToFirestore(recipeData, imageFiles);
        if (!success) throw new Error("🔥 Error saving Recipe to Firestore!");

        // alert("🎉 Blog posted successfully!");
        toast.success("Recipe posted successfully!");
        setContent("");
        setDescription("");
        setIngredients([""]);
        setThumbnail(null);
        setThumbnailURL("");
        setCategory("");
        setImages([]);
        setImageFiles([]);
        setTimeout(() => {
          navigate("/dashboard/recipies");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      // alert(error.message);
    } finally {
      setLoading(false); // Stop Loading
    }
  };

  const handleSelectChange = (selectedOption) => {
    console.log("Selected Category:", selectedOption); // Debugging log
    setSelectedCategory(selectedOption); // Set the selected category
  };

  return (
    <div className="bg-white rounded-[30px] shadow-md px-5 mb-5 lg:mb-0 h-full flex flex-col">
      <div className="h-[85%] overflow-y-scroll panelScroll">
        <div className="flex lg:flex-row flex-col border-b-2 border-gray-100 justify-between items-center pt-2 lg:h-[12%]">
          <div className="pt-3 border-b-2 border-gray-100 pb-2">
            <p className="font-HelveticaNeueMedium text-darkColor text-lg">
              Add Recipies
            </p>
            <BreadCrumbs
              link={"/dashboard/recipies"}
              firstLink="Recipies"
              secondLink="Add Recipies"
            />
          </div>
          <button
            onClick={props.onClick}
            className="border hidden rounded-full px-4  py-2 md:flex items-center font-HelveticaNeueRegular text-white bg-gkRedColor hover:bg-gkRedColor/90"
          >
            <p className="text-sm ">
              {props.bulkenabled ? "Add Recipee" : "Bulk Upload"}
            </p>
          </button>
        </div>

        {props.bulkenabled ? (
          <BulkFormSection />
        ) : (
          <div className="border-2 border-gray-100 rounded-2xl w-full px-3 py-4 mt-3">
            <div className="">
              <h2 className="text-base font-HelveticaNeueMedium pb-2">
                {id ? "Update Recipe" : "Upload Logo"}
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
            <div className="flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-[49%] my-3">
                <label className="text-sm">Short Description</label>
                <div className="">
                  <input
                    type="text"
                    placeholder="Enter description..."
                    className={`w-full mt-1 ${
                      isCheckTitle ? "border-2 border-red-600" : ""
                    } text-sm rounded-md bg-gray-100 px-3 py-2 text-gray-700`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full lg:w-[49%] mb-5 lg:mb-0">
                <label className="text-sm">Category</label>
                <Select
                  isMulti
                  value={selectedCategory} // Set value to selectedCategory
                  onChange={handleSelectChange} // Handle change
                  options={recipeCategory} // Set options here
                  className="w-full z-[9999]"
                />
              </div>
            </div>

            {/* 🔹 Rich Text Editor */}
            <div className="flex-1 h-full relative">
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
              {/* <SunEditor
              setContents={content}
              onChange={setContent}
              placeholder="Write something here..."
              setOptions={{
                minHeight: "100%",
                height: "100%",
                imageUploadUrl: null, // 🔥 Disable default base64 upload
                imageGalleryUrl: null, // 🔥 Disable gallery uploads
                buttonList: [
                  [
                    "formatBlock",
                    "bold",
                    "underline",
                    "italic",
                    "strike",
                    "list",
                    "align",
                    "link",
                    "image",
                    "video",
                    "fullScreen",
                    "undo",
                    "redo",
                  ],
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
                callBackSave: (content) => setContent(content), // ✅ Ensure content is updated
              }}
              onImageUploadBefore={(files, _, uploadHandler) => {
                handleImageUpload(files[0], {}, uploadHandler);
                return false; // 🔥 Prevent default base64 upload
              }}
              className="h-full"
            /> */}
              <SunEditor
                setContents={content}
                onChange={setContent}
                placeholder="Write something here..."
                setOptions={{
                  minHeight: "100%",
                  height: "100%",
                  imageUploadUrl: null,
                  imageGalleryUrl: null,
                  buttonList: [
                    [
                      "formatBlock",
                      "fontSize", // 👈 Font size button
                      "bold",
                      "underline",
                      "italic",
                      "strike",
                      "list",
                      "align",
                      "link",
                      "image",
                      "video",
                      "fullScreen",
                      "undo",
                      "redo",
                    ],
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
                  fontSize: [
                    8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 36, 40, 48
                  ], // ✅ Limit font sizes
                  callBackSave: (content) => setContent(content),
                }}
                onImageUploadBefore={(files, _, uploadHandler) => {
                  handleImageUpload(files[0], {}, uploadHandler);
                  return false;
                }}
                className="h-full"
              />
            </div>

            <div className="flex flex-wrap gap-[2%] mt-5">
              {ingredients.map((ing, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 w-full md:w-[49%] lg:w-[32%] mt-4"
                >
                  <p className="font-HelveticaNeueMedium">{index + 1}.</p>
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Ingredient"
                      className="w-full text-sm rounded-md bg-gray-100 pl-3 pr-7 py-2 text-gray-700"
                      value={ing}
                      onChange={(e) =>
                        handleIngredientChange(index, e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => deleteIngredient(index)}
                      className="text-red-600 hover:text-red-700 text-xl absolute top-2 right-1"
                    >
                      <IoClose />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div
              onClick={addIngredient}
              className="flex flex-col items-center justify-center py-2 text-blue-500 cursor-pointer hover:text-blue-600"
            >
              <PlusCircle size={35} className=" text-gkRedColor" />
              <span className="font-HelveticaNeueMedium text-darkColor text-base">
                Add Ingredient
              </span>
            </div>

            <div className="flex flex-wrap gap-[2%] mt-5">
              {tags.map((ing, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 w-full md:w-[49%] lg:w-[32%] mt-4"
                >
                  <p className="font-HelveticaNeueMedium">{index + 1}.</p>
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Tags"
                      className="w-full text-sm rounded-md bg-gray-100 pl-3 pr-7 py-2 text-gray-700"
                      value={ing}
                      onChange={(e) => handletagChange(index, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => deletetags(index)}
                      className="text-red-600 hover:text-red-700 text-xl absolute top-2 right-1"
                    >
                      <IoClose />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div
              onClick={addTags}
              className="flex flex-col items-center justify-center py-2 text-blue-500 cursor-pointer hover:text-blue-600"
            >
              <PlusCircle size={35} className=" text-gkRedColor" />
              <span className="font-HelveticaNeueMedium text-darkColor text-base">
                Add Tags
              </span>
            </div>
          </div>
        )}
      </div>
      {/* 🔹 Buttons */}
      {!props.bulkenabled && (
        <div className="h-[15%] flex items-center justify-center">
          {/* <div className="flex justify-end"> */}
          <Link to="/dashboard/recipies">
            <button
              className="w-[120px] py-2 font-HelveticaNeueMedium rounded-full bg-gray-200 text-darkColor mr-2"
              disabled={loading}
            >
              Cancel
            </button>
          </Link>
          <button
            onClick={handlePostClick}
            className="w-[120px] py-2 rounded-full font-HelveticaNeueMedium flex justify-center items-center bg-gkRedColor text-white hover:bg-gkRedColor/90"
            disabled={loading}
          >
            <span> {id ? "Update" : "Post"}</span>
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
          {/* </div> */}
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
