import React from "react";
import ImageTag from "../../components/reuseable/imageTag";

const NotificationCard = ({ data }) => {
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-lg w-full px-4 py-3 mt-2">
      <div className="flex items-center">
        <ImageTag
          path="/assets/images/blog.png"
          classes="size-10 rounded-full"
          altText="logo"
        />
        <div className="pl-3">
          <p className="text-sm font-HelveticaNeueMedium text-darkColor">
            {data.title}
          </p>
          <p className="text-xs font-HelveticaNeueRegular text-darkColor">
            {data.time}
          </p>
        </div>
      </div>
      <p className="text-darkColor font-HelveticaNeueRegular text-sm pt-4">
        {data.msg}
      </p>
    </div>
  );
};

export default NotificationCard;
