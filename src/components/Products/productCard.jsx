import React from "react";
import ImageTag from "../../components/reuseable/imageTag";
import { Pencil } from "lucide-react";

const ProductCard = ({ data }) => {
  return (
    <div className="border-2 border-gray-200 rounded-xl w-full px-4 py-3 mt-3">
      <div className="flex justify-center">
        <ImageTag
          path="/assets/images/product.png"
          classes="size-32"
          altText="logo"
        />
      </div>
      <div className="bg-gray-200 rounded-full w-24 flex justify-center py-1 mt-3">
        <p className="text-xs font-HelveticaNeueRegular text-darkColor">
          {data.mart}
        </p>
      </div>
      <p className="text-darkColor font-HelveticaNeueRegular text-sm pt-2">
        {data.title}
      </p>
      <p className="text-gkRedColor font-HelveticaNeueMedium text-base pt-1">
        {data.price}
      </p>
      <button className="bg-gkRedColor py-2 mt-2 text-white rounded-full w-full text-sm font-HelveticaNeueRegular flex justify-center items-center">
        <Pencil size={15}/>
        <span className="pl-2">Edit Product</span>
      </button>
    </div>
  );
};

export default ProductCard;
