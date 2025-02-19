import React from "react";
import ImageTag from "../reuseable/imageTag";

const RequestCard = ({ data }) => {
  return (
    <div className="bg-gray-100 text-darkColor rounded-2xl px-3 py-3 mt-2">
      <div className="flex items-center">
        <ImageTag
          path="/assets/images/blog.png"
          classes="size-10"
          altText="logo"
        />
        <p className="font-HelveticaNeueMedium text-sm pl-3">{data.name}</p>
      </div>
      <p className="font-HelveticaNeueRegular text-sm line-clamp-3 pt-3">{data.desc}</p>
      <div className="flex justify-between pt-4">
        <div className="w-[48%]">
          <button className="text-white w-full py-2 font-HelveticaNeueMedium bg-[#62BD4F] text-sm rounded-full">
            Accept
          </button>
        </div>
        <div className="w-[48%]">
          <button className="text-white w-full py-2 font-HelveticaNeueMedium bg-gkRedColor text-sm rounded-full">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
