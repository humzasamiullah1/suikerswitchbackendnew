import React from "react";
import { ChevronDown } from "lucide-react"

const Reminder = () => {
  return (
    <div className="bg-white rounded-[30px] shadow-md px-4 py-3">
      <div className="flex items-center justify-between">
        <p className="font-HelveticaNeueMedium text-darkColor text-sm lg:text-base">
          Reminders
        </p>
        <p className="font-HelveticaNeueMedium text-darkColor/50 cursor-pointer text-sm">
          Show More
        </p>
      </div>
      <div className="border-2 border-darkColor/10 mt-3 rounded-full py-2 px-3 flex items-center justify-between">
        <p className="font-HelveticaNeueMedium text-darkColor/50 text-sm lg:text-base">
          Renewal
        </p>
        <ChevronDown className="text-darkColor/40"/>
      </div>
      <div className="flex justify-between items-center px-3 mt-3">
        <div className="w-[65%] flex font-HelveticaNeueRegular text-darkColor text-sm">
            <div className="w-[10%]">
                <p>1.</p>
            </div>
            <div className="w-[45%]">
                <p>Manoj</p>
            </div>
            <div className="w-[45%]">
                <p>19 Apr</p>
            </div>
        </div>
        <div className="w-[35%] border-2 text-center py-1 border-darkColor/10 rounded-full">
            <p className="font-HelveticaNeueMedium text-darkColor/50 text-sm">Renewal</p>
        </div>
      </div>
      <div className="flex justify-between items-center px-3 mt-1">
        <div className="w-[65%] flex font-HelveticaNeueRegular text-darkColor text-sm">
            <div className="w-[10%]">
                <p>1.</p>
            </div>
            <div className="w-[45%]">
                <p>Arman</p>
            </div>
            <div className="w-[45%]">
                <p>15 Apr</p>
            </div>
        </div>
        <div className="w-[35%] border-2 text-center py-1 border-darkColor/10 rounded-full">
            <p className="font-HelveticaNeueMedium text-darkColor/50 text-sm">Renewal</p>
        </div>
      </div>
      <div className="flex justify-between items-center px-3 mt-1">
        <div className="w-[65%] flex font-HelveticaNeueRegular text-darkColor text-sm">
            <div className="w-[10%]">
                <p>1.</p>
            </div>
            <div className="w-[45%]">
                <p>Faizan</p>
            </div>
            <div className="w-[45%]">
                <p>29 Apr</p>
            </div>
        </div>
        <div className="w-[35%] border-2 text-center py-1 border-darkColor/10 rounded-full">
            <p className="font-HelveticaNeueMedium text-darkColor/50 text-sm">Renewal</p>
        </div>
      </div>
    </div>
  );
};

export default Reminder;
