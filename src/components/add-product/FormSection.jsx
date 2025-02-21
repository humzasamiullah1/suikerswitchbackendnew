import React, { useState } from "react";
import LabelTag from "../reuseable/label";
import { Plus } from "lucide-react";

const FormSection = () => {
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...imageUrls]);
  };

  return (
    <form className="border-2 border-gray-100 rounded-2xl w-full px-3 py-4 mt-3">
      <div className="p-4">
        <h2 className="text-lg font-HelveticaNeueMedium mb-2">Images</h2>
        <div className="flex space-x-2">
          {images.map((image, index) => (
            <div key={index} className="w-20 h-20 rounded-lg overflow-hidden">
              <img
                src={image}
                alt={`Selected ${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <label className="w-20 h-20 flex items-center justify-center bg-red-100 text-red-500 rounded-lg cursor-pointer">
            <Plus size={24} />
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between pt-5">
        <div className="w-full md:w-[49%]">
          <LabelTag isStaric={false} name="Product Name" classes="!text-sm" />
          <input
            type="text"
            placeholder="Write Product Name"
            className="w-full mt-1 text-sm font-popinsRegular rounded-md bg-bgColor px-3 py-[10px] text-darkColor placeholder:text-zinc-700/50"
          />
        </div>
        <div className="w-full md:w-[49%] pt-4 md:pt-0">
          <LabelTag isStaric={false} name="Product Price" classes="!text-sm" />
          <input
            type="text"
            placeholder="Write Product Name"
            className="w-full mt-1 text-sm font-popinsRegular rounded-md bg-bgColor px-3 py-[10px] text-darkColor placeholder:text-zinc-700/50"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between mt-4">
        <div className="w-full md:w-[49%]">
          <LabelTag isStaric={false} name="Select Brand" classes="!text-sm" />
          <select className="w-full mt-1 text-sm bg-bgColor font-popinsRegular px-3 py-2 rounded-lg text-darkColor placeholder:text-zinc-700/50">
            <option>Select Brand</option>
          </select>
        </div>
        <div className="w-full md:w-[49%] pt-4 md:pt-0">
          <LabelTag
            isStaric={false}
            name="Select Category"
            classes="!text-sm"
          />
          <select className="w-full mt-1 text-sm bg-bgColor font-popinsRegular px-3 py-2 rounded-lg text-darkColor placeholder:text-zinc-700/50">
            <option>Select Category</option>
          </select>
        </div>
      </div>
      <div className="pt-2 w-full mt-4">
        <LabelTag isStaric={false} name="Description" classes="!text-sm" />
        <textarea
          type="text"
          cols={10}
          placeholder="Write Product Description"
          className="w-full h-28 mt-1 text-sm bg-bgColor font-popinsRegular px-3 py-2 rounded-lg text-darkColor placeholder:text-zinc-700/50"
        ></textarea>
      </div>
    </form>
  );
};

export default FormSection;
