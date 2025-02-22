import React from "react";
import ImageTag from "../reuseable/imageTag"
import {Ellipsis} from 'lucide-react'
import { Link } from "react-router-dom";

const RecipiesCard = ({ data, onLikePopup }) => {
  return (
    
    <div className="rounded-xl w-full px-4 py-3 mt-3">
      <Link to={'/dashboard/recipes-detail'}>
      <div
        className="bg-cover bg-no-repeat p-4 rounded-xl"
        style={{ backgroundImage: "url('/assets/images/recipes.png')" }}
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
                {data.title}
              </p>
              <p className="font-HelveticaNeueMedium text-white text-xs">
                {data.time}
              </p>
            </div>
          </div>
          <div className="w-[40%] flex justify-end text-darkColor">
            <Ellipsis size={30} className="text-white"/>
          </div>
        </div>
        <div className="pt-28">
          <h1 className="font-HelveticaNeueMedium text-2xl text-white">{data.name}</h1>
        </div>
      </div>
      </Link>
    </div>
  );
};

export default RecipiesCard;
