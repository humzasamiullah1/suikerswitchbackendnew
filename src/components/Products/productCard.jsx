import React from "react";
import ImageTag from "../../components/reuseable/imageTag";
import { Pencil } from "lucide-react";

const ProductCard = ({ data }) => {
  return (
    <div className="border-2 border-gray-200 rounded-xl w-full px-4 py-3 mt-3">
      <div className="flex justify-center">
        <ImageTag path={data.images} classes="size-32" altText="logo" />
      </div>
      <div className="flex flex-wrap">
        {data.selectedSupermarkets.map((item, index) => (
          <div className="bg-gray-200 rounded-full px-2 flex justify-center py-1 mt-3 mr-2">
            <p className="text-xs font-HelveticaNeueRegular text-darkColor">
              {item}
            </p>
          </div>
        ))}
      </div>
      <p className="text-darkColor font-HelveticaNeueMedium text-base pt-2">
        {data.productName}
      </p>
      <div className="flex justify-between">
        <div className="w-[35%]">
          <p>Category:</p>
        </div>
        <div className="w-[73%] flex">
          {data.selectedCategories.map((item, index) => (
            <p>{item},</p>
          ))}
        </div>
      </div>
      <p className="text-gkRedColor font-HelveticaNeueMedium text-base pt-1">
        Rs. {data.productPrice}
      </p>
      <button className="bg-gkRedColor py-2 mt-2 text-white rounded-full w-full text-sm font-HelveticaNeueRegular flex justify-center items-center">
        <Pencil size={15} />
        <span className="pl-2">Edit Product</span>
      </button>
    </div>
  );
};

export default ProductCard;
