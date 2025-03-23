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

const Card = ({ data, onDelete, highlightSearchTerm, isShow = false }) => {
  return (
    <div className="border-2 border-gray-200 h-[300px] rounded-xl w-full px-4 py-3 mt-3 relative">
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
          <ImageTag path={data.images} classes="size-32" altText="logo" />
        </div>
        <p className="text-darkColor font-HelveticaNeueMedium text-sm pt-2">
          <HighlightedText
            text={data.supermarketName}
            searchTerm={highlightSearchTerm}
          />
        </p>
        <div className="font-HelveticaNeueRegular text-darkColor text-sm flex items-center justify-between pt-2">
          <p className="line-clamp-3">
            <HighlightedText
              text={data.description}
              searchTerm={highlightSearchTerm}
            />
          </p>
        </div>
      </div>
      <Link
        to={`/dashboard/add-supermarkets?id=${data.id}`}
        className="h-[10%] flex items-center"
      >
        <button className="bg-gkRedColor py-2 text-white rounded-full w-full text-sm font-HelveticaNeueRegular flex justify-center items-center">
          {isShow ? (
            <>
              <Pencil size={15} />
              <span className="pl-2">Edit SuperMarket</span>
            </>
          ) : (
            <span className="pl-2">Show SuperMarket</span>
          )}
        </button>
      </Link>
    </div>
  );
};

export default Card;
