import React, { useState } from "react";
import LabelTag from "../reuseable/label";
import { EyeOff, Eye } from "lucide-react";

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const [isToggled2, setIsToggled2] = useState(false);

  const handleToggle2 = () => {
    setIsToggled2(!isToggled2);
  };

  const [isToggled3, setIsToggled3] = useState(false);

  const handleToggle3 = () => {
    setIsToggled3(!isToggled3);
  };

  return (
    <div className="h-full">
      <div className="border-2 border-gray-100 rounded-xl px-3">
        <div className="pt-3">
          <h1 className="font-HelveticaNeueMedium text-darkColor pb-2 text-base border-b-2 border-gray-100">
            Change Password
          </h1>
        </div>
        <form className=" w-full pb-3">
          <div className="w-full mt-3">
            <LabelTag name="Current Password" classes="!text-xs" />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password here.."
                className="w-full mt-1 text-sm bg-bgColor font-popinsRegular px-3 py-2 rounded-full text-darkColor placeholder:text-zinc-700/50"
              />
              <div
                title="Show password"
                className="absolute right-3 top-3 text-stone-950/40 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </div>
            </div>
          </div>
          <div className="w-full mt-1">
            <LabelTag name="New Password" classes="!text-xs" />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password here.."
                className="w-full mt-1 text-sm bg-bgColor font-popinsRegular px-3 py-2 rounded-full text-darkColor placeholder:text-zinc-700/50"
              />
              <div
                title="Show password"
                className="absolute right-3 top-3 text-stone-950/40 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </div>
            </div>
          </div>
          <div className="w-full mt-1">
            <LabelTag name="Confirm New Password" classes="!text-xs" />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password here.."
                className="w-full mt-1 text-sm bg-bgColor font-popinsRegular px-3 py-2 rounded-full text-darkColor placeholder:text-zinc-700/50"
              />
              <div
                title="Show password"
                className="absolute right-3 top-3 text-stone-950/40 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="border-2 border-gray-100 rounded-xl px-3 mt-5">
        <div className="pt-3">
          <h1 className="font-HelveticaNeueMedium text-darkColor pb-2 text-base border-b-2 border-gray-100">
            Notifications
          </h1>
          <div className="flex items-center w-full justify-between pt-3">
            <div>
                <p className="font-HelveticaNeueMedium text-sm text-darkColor">Notification 1</p>
                <p className="font-HelveticaNeueRegular text-darkColor text-xs">Lorem ipsum dior dolar </p>
            </div>
            <button
              onClick={handleToggle}
              className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition ${
                isToggled ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-3 h-3 bg-white rounded-full shadow-md transform transition ${
                  isToggled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center w-full justify-between pt-3">
            <div>
                <p className="font-HelveticaNeueMedium text-sm text-darkColor">Notification 1</p>
                <p className="font-HelveticaNeueRegular text-darkColor text-xs">Lorem ipsum dior dolar </p>
            </div>
            <button
              onClick={handleToggle2}
              className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition ${
                isToggled2 ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-3 h-3 bg-white rounded-full shadow-md transform transition ${
                  isToggled2 ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center w-full justify-between py-3">
            <div>
                <p className="font-HelveticaNeueMedium text-sm text-darkColor">Notification 1</p>
                <p className="font-HelveticaNeueRegular text-darkColor text-xs">Lorem ipsum dior dolar </p>
            </div>
            <button
              onClick={handleToggle3}
              className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition ${
                isToggled3 ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-3 h-3 bg-white rounded-full shadow-md transform transition ${
                  isToggled3 ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
