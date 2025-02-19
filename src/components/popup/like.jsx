import React, { useState } from "react";
import { X } from "lucide-react";
import ImageTag from "../../components/reuseable/imageTag";

const LikePopup = ({ data, onClose }) => {
  const [likeData, setLikeData] = useState([
    {
      name: "Olivia Martin",
    },
    {
      name: "Olivia Martin",
    },
    {
      name: "Olivia Martin",
    },
    {
      name: "Olivia Martin",
    },
    {
      name: "Olivia Martin",
    },
  ]);
  return (
    <main className="w-full h-screen backdrop-blur-sm bg-black/80 fixed inset-0 z-50 flex items-center justify-center">
      <section className="w-[90%] sm:w-[65%] md:w-[50%] lg:w-[40%] xl:w-[30%] bg-texture myshades rounded-[31px] mx-auto">
        <div class="bg-white py-8 lg:py-5 rounded-xl justify-center items-center flex flex-col">
          <div className="flex justify-between w-[90%] pb-2 mx-auto border-b-2 border-gray-100">
            <h1 className="font-HelveticaNeueMedium text-darkColor text-base">
              4 Likes
            </h1>
            <X className="cursor-pointer" onClick={onClose}/>
          </div>
          {likeData.map((item, index) => (
            <div className="flex items-center justify-start w-[90%] mt-2">
              <ImageTag
                path="/assets/images/blog.png"
                classes="size-10 rounded-full object-cover"
                altText="logo"
              />
              <p className="font-HelveticaNeueMedium pl-2 text-darkColor text-sm">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default LikePopup;
