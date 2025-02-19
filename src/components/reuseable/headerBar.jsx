import React from "react";
import { Search, Bell, MessageCircleMore } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const HeaderBar = (props) => {
  const { heading, subHeading } = props;
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

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
      <div className="lg:w-[50%] w-full flex justify-between pt-4 xl:pt-0">
        <div className="relative w-[60%] md:w-[75%] lg:w-[65%] xl:w-[79%]">
          <input
            type="text"
            placeholder="Search"
            className="w-full font-HelveticaNeueRegular mt-1 bg-white py-3 text-sm rounded-full text-darkColor placeholder:text-zinc-700/50"
          />
          <div className="absolute top-[5px] right-0 bg-gkRedColor rounded-full size-10 flex justify-center items-center">
            <Search color="#FFFF" size={18} />
          </div>
        </div>
        <div className="flex w-[40%] md:w-[25%] lg:w-[35%] xl:w-[20%] justify-end">
          <div className="bg-white size-12 rounded-full flex justify-center items-center">
            <MessageCircleMore />
          </div>
          <Link to={"/dashboard/notification"}>
            <div className={`${
                      isActive('/dashboard/notification') ? "bg-gkRedColor text-white" : "text-darkColor bg-white hover:bg-gkRedColor hover:text-white"
                    } size-12 rounded-full flex justify-center items-center ml-3`}>
              <Bell />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
