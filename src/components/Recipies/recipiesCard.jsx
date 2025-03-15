import React from "react";
import ImageTag from "../../components/reuseable/imageTag";
import { Ellipsis, ThumbsUp, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const timeAgo = (timestamp) => {
  const now = new Date();
  const createdAt = new Date(timestamp);
  const diffInSeconds = Math.floor((now - createdAt) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};

const RecipiesCard = ({ data, onLikePopup, onCommentPopup }) => {
  return (
    <div className="border-2 border-gray-200 rounded-xl w-full px-4 py-3 mt-3">
      <Link to={`/dashboard/recipes-detail/${data.recipeId}`}>
        <div className="flex justify-between items-center border-b-2 border-darkColor/20 pb-3">
          <div className="w-[60%] flex items-center">
            <ImageTag
              path="/assets/images/blog.png"
              classes="size-10"
              altText="logo"
            />
            <div className="pl-3">
              <p className="font-HelveticaNeueMedium text-darkColor text-base">
                {data.fullName}
              </p>
              <p className="font-HelveticaNeueMedium text-darkColor/60 text-xs">
                {timeAgo(data.createdAt)}
              </p>
            </div>
          </div>
          <div className="w-[40%] flex justify-end text-darkColor">
            <Ellipsis size={30} />
          </div>
        </div>
        <p className="font-HelveticaNeueRegular text-darkColor text-sm py-4">
          {data.description}
        </p>
        <ImageTag
          path={data.thumbnail}
          classes="w-full h-60 rounded-2xl object-cover"
          altText="logo"
        />
      </Link>
      { data.IsLike &&
        <div className="flex pt-10">
        <div className="w-[20%] flex text-darkColor">
          <ThumbsUp size={20} />
          <MessageCircle size={20} className="ml-6" />
        </div>
        <div className="w-[80%] font-HelveticaNeueRegular text-darkColor flex justify-end">
          <div
            className="flex items-center pr-5 cursor-pointer"
            onClick={onLikePopup}
          >
            <ThumbsUp size={18} />
            <p className="pl-2 text-sm">{data.like} Likes</p>
          </div>
          <div className="flex items-center pr-5 cursor-pointer" onClick={onCommentPopup}>
            <MessageCircle size={18} />
            <p className="pl-2 text-sm">{data.comments} Comments</p>
          </div>
        </div>
        <div>
          <ImageTag
            path="/assets/images/userprofile.png"
            classes="size-8 rounded-full object-cover"
            altText="logo"
          />
        </div>
      </div>
      }
      
    </div>
  );
};

export default RecipiesCard;
