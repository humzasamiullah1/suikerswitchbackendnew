import React from "react";
import ImageTag from "../../components/reuseable/imageTag";
import { Pencil } from "lucide-react";

const Card = ({ data }) => {
  return (
    <div className="border-2 border-gray-200 rounded-xl w-full px-4 py-3 mt-3">
      <div className="flex justify-center">
        <ImageTag
          path="/assets/images/supermarket.png"
          classes="size-32"
          altText="logo"
        />
      </div>
      <p className="text-darkColor font-HelveticaNeueMedium text-sm pt-2">
        {data.title}
      </p>
      <div className="font-HelveticaNeueRegular text-darkColor text-sm flex items-center justify-between pt-2">
        <p className="">Total Brands</p>
        <p className="">
          {data.totalBrand}
        </p>
      </div>
      <div className="font-HelveticaNeueRegular text-darkColor text-sm flex items-center justify-between pt-1">
        <p className="">Ratings</p>
        <p className="">
          {data.ratings}
        </p>
      </div>

      <button className="bg-gkRedColor py-2 mt-2 text-white rounded-full w-full text-sm font-HelveticaNeueRegular flex justify-center items-center">
        <Pencil size={15} />
        <span className="pl-2">Edit SuperMarket</span>
      </button>
    </div>
  );
};

export default Card;
