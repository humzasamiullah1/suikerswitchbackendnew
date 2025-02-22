import React, { useState } from "react";
import { Plus } from "lucide-react";
import LabelTag from "../reuseable/label";

const EditProfile = () => {
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...imageUrls]);
  };

  return (
    <div className="border-2 border-gray-100 rounded-xl px-3 h-full">
      <div className="pt-3">
        <h1 className="font-HelveticaNeueMedium text-darkColor pb-2 text-base border-b-2 border-gray-100">
          Edit Profile
        </h1>
      </div>
      <form className=" w-full pb-3 h-[90%] overflow-scroll panelScroll">
        <div className="px-2 pt-2">
          <h2 className="text-sm font-HelveticaNeueMedium pb-2">
            Profile Picture*
          </h2>
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
        <div className="w-full mt-3">
          <LabelTag name="First Name" classes="!text-xs" />
          <input
            type="text"
            placeholder="Write here..."
            className="w-full mt-1 text-sm font-popinsRegular rounded-full bg-bgColor px-3 py-2 text-darkColor placeholder:text-zinc-700/50"
          />
        </div>
        <div className="w-full pt-1">
          <LabelTag name="Last Name" classes="!text-xs" />
          <input
            type="text"
            placeholder="Write here..."
            className="w-full mt-1 text-sm font-popinsRegular rounded-full bg-bgColor px-3 py-2 text-darkColor placeholder:text-zinc-700/50"
          />
        </div>
        <div className="w-full pt-1">
          <LabelTag name="Date of Birth" classes="!text-xs" />
          <input
            type="date"
            placeholder="Select date..."
            className="w-full mt-1 text-sm font-popinsRegular rounded-full bg-bgColor px-3 py-2 text-darkColor placeholder:text-zinc-700/50"
          />
        </div>

        <div className="w-full pt-1">
          <LabelTag name="Phone Number" classes="!text-xs" />
          <input
            type="text"
            placeholder="Write here..."
            className="w-full mt-1 text-sm font-popinsRegular rounded-full bg-bgColor px-3 py-2 text-darkColor placeholder:text-zinc-700/50"
          />
        </div>
        <div className="w-full pt-1">
          <LabelTag name="Email" classes="!text-xs" />
          <input
            type="text"
            placeholder="Write here..."
            className="w-full mt-1 text-sm font-popinsRegular rounded-full bg-bgColor px-3 py-2 text-darkColor placeholder:text-zinc-700/50"
          />
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
