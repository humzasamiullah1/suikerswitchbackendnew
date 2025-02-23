import React from "react";
import ImageTag from "../../components/reuseable/imageTag";
import { Ellipsis, ThumbsUp, MessageCircle } from "lucide-react";
import {Link} from 'react-router-dom'

const HelpCard = ({ data, onLikePopup, onCommentsClick }) => {
  return (
    <div className="border-2 border-gray-200 rounded-xl w-full px-4 py-3 mt-3">
      <Link to={"/dashboard/help-elker-detail"}>
        <div className="flex justify-between items-center border-b-2 border-darkColor/20 pb-3">
          <div className="w-[60%] flex items-center">
            <ImageTag
              path="/assets/images/blog.png"
              classes="size-10"
              altText="logo"
            />
            <div className="pl-3">
              <p className="font-HelveticaNeueMedium text-darkColor text-base">
                {data.title}
              </p>
              <p className="font-HelveticaNeueMedium text-darkColor/60 text-xs">
                {data.time}
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
          path="/assets/images/post.png"
          classes="w-full h-60 rounded-2xl object-cover"
          altText="logo"
        />
      </Link>
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
          <div
            className="flex items-center pr-5 cursor-pointer"
            onClick={onCommentsClick}
          >
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
    </div>
  );
};

export default HelpCard;
