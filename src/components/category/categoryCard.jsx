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
        part?.toLowerCase() === searchTerm?.toLowerCase() ? (
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

const CategoryCard = ({
  data,
  onDelete,
  highlightSearchTerm,
  isShow = false,
  hidebutton,
}) => {
  return (
    <div className="border-2 border-gray-200 rounded-xl h-[400px] md:h-[350px] w-full px-4 py-3 mt-3 relative">
      {isShow && (
        <div
          className="bg-gkRedColor rounded-full cursor-pointer flex justify-center items-center w-7 h-7 absolute right-[-7px] top-[-13px]"
          onClick={onDelete}
        >
          <Trash2 className="text-white" size={18} />
        </div>
      )}
      <div className="h-[90%]">
        <div className="flex justify-center">
          <ImageTag path={data?.images} classes="size-32" altText="logo" />
        </div>
        <div className="flex flex-wrap">
          {data?.subCategory?.slice(0, 3)?.map((item, index) => (
            <div className="bg-gray-200 rounded-full px-2 flex justify-center py-1 mt-3 mr-2">
              <p className="text-xs font-HelveticaNeueRegular text-darkColor">
                {item.name}
              </p>
            </div>
          ))}
        </div>
        <p className="text-darkColor font-HelveticaNeueMedium line-clamp-1 text-base pt-2">
          <HighlightedText
            text={data?.categoryName}
            searchTerm={highlightSearchTerm}
          />
        </p>
      </div>
      {!hidebutton && (
        <Link to={`/dashboard/add-category?id=${data?.id}`} className="h-[10%] flex items-center">
          <button className="bg-gkRedColor py-2  text-white rounded-full w-full text-sm font-HelveticaNeueRegular flex justify-center items-center">
            {isShow ? (
              <>
                <Pencil size={15} />
                <span className="pl-2">Edit Category</span>
              </>
            ) : (
              <span className="pl-2">Show Category</span>
            )}
          </button>
        </Link>
      )}
    </div>
  );
};

export default CategoryCard;
