import React, { useState, useEffect } from "react";

import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { toast } from "react-toastify";

import { X, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  getRecipe,
  addWeeklyMenu,
  updateWeeklyMenuToFirebase,
  getWeeklyMenuById,
} from "../utils/firebasefunctions";

const daysOfWeek = [
  "Maandag",
  "Dinsdag",
  "Woensdag",
  "Donderdag",
  "Vrijdag",
  "Zaterdag",
  "Zondag",
];

const categoryOptions = [
  "Zoet ontbijt",
  "Hartig ontbijt",
  "Lunch",
  "Diner",
  "Snack",
  "Smoothies",
  "Zoete baksels",
  "Brunch",
  "Feestelijk",
  "Ontbijt",
];

const FormSection = () => {
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [recipeData, setRecipeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");

  const [expandedDays, setExpandedDays] = useState(() => {
    const init = {};
    daysOfWeek.forEach((day) => {
      init[day] = true; // default to open
    });
    return init;
  });
  const [expandedMenus, setExpandedMenus] = useState({});

  const fetchMenuDetails = async (menuId) => {
    try {
      const menuData = await getWeeklyMenuById(menuId);
      if (menuData) {
        setTitle(menuData.title);
        setImages(menuData.images || []);
        setFormData(menuData.WeeklyMenu || {});
      }
    } catch (error) {
      toast.error("Error fetching product details");
    }
  };

  useEffect(() => {
    if (id) {
      fetchMenuDetails(id); // ✅ Fetch product if editing
    }
  }, [id]);

  const fetchData = async () => {
    const data = await getRecipe();
    setRecipeData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const removeImage = () => {
    setImages([]);
    setImageFiles([]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));

    setImages([...imageUrls]);
    setImageFiles([...files]);
  };

  const handleToggleInputMode = (day, rowIndex) => {
    const updatedDay = [...formData[day]];
    const currentRow = updatedDay[rowIndex];
    const isTogglingOn = !currentRow.showInput;

    currentRow.showInput = isTogglingOn;

    if (isTogglingOn) {
      // Clear recipe when switching to input mode
      currentRow.recipe = {
        id: null,
        description: "",
        image: [],
      };
    }

    setFormData((prev) => ({
      ...prev,
      [day]: updatedDay,
    }));
  };

  const [formData, setFormData] = useState(() => {
    const initialData = {};
    daysOfWeek.forEach((day, i) => {
      initialData[day] = [];
    });

    return initialData;
  });

  const handleDayRowAdd = (day) => {
    const newFormData = { ...formData };
    newFormData[day].push({ category: "", recipe: "", showInput: false });
    setFormData(newFormData);

    const newIndex = newFormData[day].length - 1;
    const key = `${day}-${newIndex}`;

    // 👉 Expand the newly added menu section by default
    setExpandedMenus((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const handleDayRowDelete = (day, rowIndex) => {
    const updated = formData[day].filter((_, idx) => idx !== rowIndex);
    setFormData((prev) => ({
      ...prev,
      [day]: updated,
    }));
  };

  const handleChange = (day, rowIndex, field, value) => {
    const updatedDay = [...formData[day]];
    updatedDay[rowIndex][field] = value;
    setFormData((prev) => ({
      ...prev,
      [day]: updatedDay,
    }));
  };

  const toggleDayExpand = (day) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const toggleMenuExpand = (day, index) => {
    const key = `${day}-${index}`;
    setExpandedMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Title validation
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    // Global image validation
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    // Loop through each day
    for (const day of daysOfWeek) {
      for (const [index, entry] of formData[day].entries()) {
        const menuNum = index + 1;

        if (!entry.category) {
          toast.error(`Category is missing in ${day}, menu ${menuNum}`);
          return;
        }

        const recipe = entry.recipe;

        if (!recipe || typeof recipe !== "object") {
          toast.error(
            `Recipe is missing or invalid in ${day}, menu ${menuNum}`
          );
          return;
        }

        if (entry.showInput) {
          if (!recipe.description || !recipe.description.trim()) {
            toast.error(
              `Recipe description is required in ${day}, menu ${menuNum}`
            );
            return;
          }

          const image = recipe.image;

          if (!image || !Array.isArray(image) || image.length === 0) {
            toast.error(`Recipe image is required in ${day}, menu ${menuNum}`);
            return;
          }

          // ✅ Allow already uploaded image (string) OR new file (File object)
          const isValidImage =
            typeof image[0] === "string" || image[0] instanceof File;

          if (!isValidImage) {
            toast.error(`Invalid recipe image in ${day}, menu ${menuNum}`);
            return;
          }
        } else {
          if (!recipe.id) {
            toast.error(`Please select a recipe in ${day}, menu ${menuNum}`);
            return;
          }
        }
      }
    }

    setLoading(true);

    const weeklyMenu = {
      title,
      timestamp: Date.now(),
      images,
      WeeklyMenu: formData,
    };

    try {
      if (id) {
        await updateWeeklyMenuToFirebase(id, weeklyMenu, imageFiles);
        toast.success("Weekly Menu updated successfully!");
      } else {
        await addWeeklyMenu(weeklyMenu, imageFiles);
        toast.success("Weekly Menu added successfully!");
      }

      setTimeout(() => {
        navigate("/dashboard/weekly-menu");
      }, 1000);
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
      {/* Image Upload */}
      <div className="px-2 pt-2">
        <h2 className="text-base font-HelveticaNeueMedium pb-2">
          {id ? "Update Image" : "Upload Image"}
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

      {/* Title */}
      <div className="pt-5">
        <label className="text-sm">Title</label>
        <input
          type="text"
          placeholder="Enter Weekly Menu Title..."
          className="w-full mt-1 text-sm rounded-md bg-gray-100 px-3 py-2 text-gray-700"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Days */}
      {daysOfWeek.map((day) => (
        <div key={day} className="mb-8 mt-5 border p-4 rounded-lg shadow">
          <div
            className="flex items-center justify-between mb-2 cursor-pointer"
            onClick={() => toggleDayExpand(day)}
          >
            <div className="">
              <h2 className="text-xl font-bold">{day}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDayRowAdd(day); // 👈 Add Menu
                }}
                className="bg-gkRedColor text-white p-2 rounded-full hover:bg-gkRedColor/90"
              >
                <Plus />
              </button>
              {expandedDays[day] ? <ChevronUp /> : <ChevronDown />}
            </div>
          </div>

          {expandedDays[day] &&
            formData[day].map((row, rowIndex) => {
              const key = `${day}-${rowIndex}`;
              return (
                <div
                  key={rowIndex}
                  className="border p-3 mb-4 rounded bg-gray-50"
                >
                  <div
                    className="flex justify-between mb-3 cursor-pointer"
                    onClick={() => toggleMenuExpand(day, rowIndex)}
                  >
                    <p className="font-HelveticaNeueMedium">
                      Menu {rowIndex + 1}.
                    </p>
                    <div className="flex gap-2 items-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleInputMode(day, rowIndex);
                        }}
                        className={`w-10 h-6 flex items-center rounded-full p-1 transition ${
                          row.showInput ? "bg-gkRedColor" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
                            row.showInput ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDayRowDelete(day, rowIndex);
                        }}
                        className="bg-gkRedColor text-white p-2 rounded-full hover:bg-gkRedColor/90"
                      >
                        <Trash2 className="size-5" />
                      </button>
                      {expandedMenus[key] ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </div>
                  <hr />

                  {expandedMenus[key] && (
                    <>
                      {/* Category & Recipe Select */}
                      {row.showInput && (
                        <div className="flex justify-end w-full">
                          <div className="mt-3 w-[49%] ">
                            <div className="flex space-x-2 mt-2">
                              {row.recipe.image?.length > 0 ? (
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                  <img
                                    src={
                                      row.recipe.image[0] instanceof File
                                        ? URL.createObjectURL(
                                            row.recipe.image[0]
                                          )
                                        : row.recipe.image[0]
                                    }
                                    alt="Uploaded"
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                    onClick={() =>
                                      handleChange(day, rowIndex, "recipe", {
                                        ...row.recipe,
                                        image: [],
                                      })
                                    }
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
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        handleChange(day, rowIndex, "recipe", {
                                          ...row.recipe,
                                          id: null,
                                          image: [file],
                                        });
                                      }
                                    }}
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col md:flex-row gap-4 my-4">
                        <div className="w-[49%]">
                          <select
                            className="w-full mt-1 bg-gray-100 px-3 py-2 rounded-md text-gray-700 text-sm border border-gray-500"
                            value={row.category}
                            onChange={(e) =>
                              handleChange(
                                day,
                                rowIndex,
                                "category",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select Category</option>
                            {categoryOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-[49%]">
                          {row.showInput ? (
                            <>
                              {/* Recipe Name Input */}
                              <input
                                type="text"
                                placeholder="Enter Recipe Name"
                                className="w-full mt-1 bg-gray-100 px-3 py-2 rounded-md text-gray-700 text-sm border border-gray-500"
                                value={row.recipe?.description || ""}
                                onChange={(e) =>
                                  handleChange(day, rowIndex, "recipe", {
                                    ...row.recipe,
                                    id: null,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </>
                          ) : (
                            // Select Dropdown View
                            <select
                              className="w-full mt-1 bg-gray-100 px-3 py-2 rounded-md text-gray-700 text-sm border border-gray-500"
                              value={row.recipe.id}
                              onChange={(e) => {
                                const selectedOption = recipeData
                                  .map((opt) => ({
                                    id: opt.id,
                                    description: opt.description,
                                    image: opt.images,
                                  }))
                                  .find((opt) => opt.id === e.target.value);

                                handleChange(
                                  day,
                                  rowIndex,
                                  "recipe",
                                  selectedOption
                                );
                              }}
                            >
                              <option value="">Select Recipe</option>
                              {recipeData.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  {opt.description}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      ))}
      <div className="flex items-center justify-center gap-2 mt-7">
        <Link to="/dashboard/weekly-menu">
          <button
            type="button"
            className="border text-xs rounded-full px-8 py-2 bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
        </Link>
        <button
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
