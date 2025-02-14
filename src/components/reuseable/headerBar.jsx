import React from "react";
import { Search } from "lucide-react";
import ImageTag from "../../components/reuseable/imageTag";

const HeaderBar = (props) => {
  const { heading, subHeading } = props;

  return (
    <div className="flex w-full lg:flex-row flex-col">
      <div className="lg:w-[50%] w-full">
        <h1 className="font-HelveticaNeueMedium font-bold text-darkColor text-xl">
          {heading}
        </h1>
        <p className="font-HelveticaNeueRegular text-darkColor text-sm">
          {subHeading}
        </p>
      </div>
      <div className="lg:w-[50%] w-full flex justify-between pt-4 md:pt-0">
        <div className="relative w-[60%] md:w-[75%]">
          <input
            type="text"
            placeholder="Search"
            className="w-full font-HelveticaNeueRegular mt-1 bg-white py-3 text-sm rounded-full text-darkColor placeholder:text-zinc-700/50"
          />
          <div className="absolute top-[5px] right-0 bg-gkRedColor rounded-full size-10 flex justify-center items-center">
            <Search color="#FFFF" size={18} />
          </div>
        </div>
        <div className="flex w-[40%] md:w-[25%] justify-end">
          <div className="bg-white size-14 rounded-full flex justify-center items-center">
            <ImageTag
              path="/assets/images/messageBadge.png"
              classes="size-8"
              altText="logo"
            />
          </div>
          <div className="bg-white size-14 rounded-full flex justify-center items-center ml-3">
            <ImageTag
              path="/assets/images/notification.png"
              classes="size-8"
              altText="logo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
