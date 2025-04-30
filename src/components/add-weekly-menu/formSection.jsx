import React, { useState } from "react";

import { X, Plus, Trash } from "lucide-react";

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
];

const FormSection = () => {
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [title, setTitle] = useState("");

  const removeImage = () => {
    setImages([]);
    setImageFiles([]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));

    setImages([...imageUrls]); // Replace existing image
    setImageFiles([...files]); // Replace image file
  };

  const [formData, setFormData] = useState(() => {
    const initialData = {};
    daysOfWeek.forEach((day) => {
      initialData[day] = [
        {
          category: "",
          recipe: "",
          ingredients: [""],
        },
      ];
    });
    return initialData;
  });

  const handleDayRowAdd = (day) => {
    setFormData((prev) => ({
      ...prev,
      [day]: [...prev[day], { category: "", recipe: "", ingredients: [""] }],
    }));
  };

  const handleDayRowDelete = (day, rowIndex) => {
    setFormData((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, idx) => idx !== rowIndex),
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

  const handleIngredientChange = (day, rowIndex, ingIndex, value) => {
    const updatedDay = [...formData[day]];
    updatedDay[rowIndex].ingredients[ingIndex] = value;
    setFormData((prev) => ({
      ...prev,
      [day]: updatedDay,
    }));
  };

  const addIngredient = (day, rowIndex) => {
    const updatedDay = [...formData[day]];
    updatedDay[rowIndex].ingredients.push("");
    setFormData((prev) => ({
      ...prev,
      [day]: updatedDay,
    }));
  };

  const deleteIngredient = (day, rowIndex, ingIndex) => {
    const updatedDay = [...formData[day]];
    updatedDay[rowIndex].ingredients.splice(ingIndex, 1);
    setFormData((prev) => ({
      ...prev,
      [day]: updatedDay,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Final Form Data:", formData);
  };

  return (
    <form className="border-2 border-gray-100 rounded-2xl w-full px-3 py-4 mt-3">
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
        <label className="text-sm">Title</label>
        <input
          type="text"
          placeholder="Enter category name"
          className={`w-full mt-1 text-sm rounded-md bg-gray-100 px-3 py-2 text-gray-700`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      {daysOfWeek.map((day) => (
        <div key={day} className="mb-8 border p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">{day}</h2>
            <button
              type="button"
              onClick={() => handleDayRowAdd(day)}
              className="bg-gkRedColor text-white p-2 rounded-full hover:bg-gkRedColor/90"
            >
              <Plus />
            </button>
          </div>

          {formData[day].map((row, rowIndex) => (
            <div key={rowIndex} className="border p-3 mb-4 rounded bg-gray-50">
              <div className="">
                <button
                  type="button"
                  onClick={() => handleDayRowDelete(day, rowIndex)}
                  className="text-red-600 border border-red-600 px-2 py-1 rounded hover:bg-red-100"
                >
                  <Trash className="size-5"/>
                </button>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mb-2">
                <select
                  className="border p-2 rounded w-full md:w-1/4"
                  value={row.category}
                  onChange={(e) =>
                    handleChange(day, rowIndex, "category", e.target.value)
                  }
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Recipe"
                  className="border p-2 rounded w-full md:w-1/2"
                  value={row.recipe}
                  onChange={(e) =>
                    handleChange(day, rowIndex, "recipe", e.target.value)
                  }
                />
              </div>

              {row.ingredients.map((ing, ingIndex) => (
                <div
                  key={ingIndex}
                  className="flex items-center gap-2 mb-2 ml-4"
                >
                  <input
                    type="text"
                    placeholder="Ingredient"
                    className="border p-2 rounded w-full md:w-1/2"
                    value={ing}
                    onChange={(e) =>
                      handleIngredientChange(
                        day,
                        rowIndex,
                        ingIndex,
                        e.target.value
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => deleteIngredient(day, rowIndex, ingIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addIngredient(day, rowIndex)}
                className="ml-4 text-blue-600 text-sm hover:underline"
              >
                + Add Ingredient
              </button>
            </div>
          ))}
        </div>
      ))}
    </form>
  );
};

export default FormSection;
