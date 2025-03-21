import React from "react";
import ImageTag from "../../components/reuseable/imageTag";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const HighlightedText = ({ text, searchTerm }) => {
  if (!searchTerm) return <>{text}</>;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span key={index} style={{ backgroundColor: "yellow" }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

const ProductCard = ({ data, onDelete, highlightSearchTerm }) => {
  return (
    <div className="border-2 border-gray-200 rounded-xl w-full px-4 py-3 mt-3 relative">
      <div className="bg-gkRedColor rounded-full cursor-pointer flex justify-center items-center w-7 h-7 absolute right-[-7px] top-[-13px]" onClick={onDelete}>
        <Trash2 className="text-white" size={18}/>
      </div>
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
         <HighlightedText text={data.productName} searchTerm={highlightSearchTerm} />
      </p>
      <div className="flex justify-between flex-wrap text-xs lg:text-sm">
        <div className="w-[40%] lg:w-[35%]">
          <p>Category:</p>
        </div>
        <div className="w-[57%] lg:w-[73%] flex flex-wrap whitespace-nowrap">
          {data.selectedCategories.map((item, index) => (
            <p>{item},</p>
          ))}
        </div>
      </div>
      <Link to={`/dashboard/add-product?id=${data.id}`}>
        <button className="bg-gkRedColor py-2 mt-2 text-white rounded-full w-full text-sm font-HelveticaNeueRegular flex justify-center items-center">
          <Pencil size={15} />
          <span className="pl-2">Edit Product</span>
        </button>
      </Link>
    </div>
  );
};

export default ProductCard;
