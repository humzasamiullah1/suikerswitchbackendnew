import React from "react";
import ImageTag from "../reuseable/imageTag";
import { Ellipsis } from "lucide-react";
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

const BlogCard = ({ data, onLikePopup }) => {
  const imageUrl = data.thumbnail?.startsWith("http")
    ? data.thumbnail
    : "/assets/images/abc.png";
  return (
    <div className="rounded-xl w-full px-4 py-3 mt-3">
      
      <Link to={`/dashboard/blogs-detail/${data.blogsId}`}>
        <div
          className="bg-cover bg-no-repeat p-4 rounded-xl"
          style={{
            backgroundImage: `url("${imageUrl}")`,
          }}
        >
          <div className="flex justify-between items-center border-b-2 border-darkColor/20 pb-3">
            <div className="w-[60%] flex items-center">
              <ImageTag
                path="/assets/images/blog.png"
                classes="size-10"
                altText="logo"
              />
              <div className="pl-3">
                <p className="font-HelveticaNeueMedium text-white text-base">
                  {data.fullName}
                </p>
                <p className="font-HelveticaNeueMedium text-white text-xs">
                  {timeAgo(data.createdAt)}
                </p>
              </div>
            </div>
            <div className="w-[40%] flex justify-end text-darkColor">
              <Ellipsis size={30} className="text-white" />
            </div>
          </div>
          <div className="pt-28">
            <h1 className="font-HelveticaNeueMedium text-2xl text-white">
              {data.description}
            </h1>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
