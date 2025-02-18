import React, { useState } from "react";
import LabelTag from "../reuseable/label";
import ButtonTag from "../reuseable/button";
import { EyeOff, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const FormSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmShowPassword(!confirmShowPassword);
  };

  return (
    <form>
      <div class="w-full mt-3">
        <LabelTag name="Email" />
        <input
          type="text"
          placeholder="Enter your email.."
          className="w-full font-popinsRegular mt-1 bg-bgColor px-3 py-2 text-sm rounded-full text-darkColor placeholder:text-zinc-700/50"
        />
      </div>
      <div className="flex flex-col lg:flex-row justify-between mt-4">
        <div className="w-full lg:w-[49%]">
          <LabelTag name="First name" />
          <input
            type="text"
            placeholder="Enter your first name here.."
            className="w-full mt-1 bg-bgColor  px-3 py-2 text-sm rounded-full text-darkColor placeholder:text-zinc-700/50 font-popinsRegular"
          />
        </div>
        <div className="w-full lg:w-[49%] mt-4 lg:mt-0">
          <LabelTag name="Last name" />
          <input
            type="text"
            placeholder="Enter your last name here.."
            className="w-full mt-1 bg-bgColor px-3 py-2 text-sm rounded-full text-darkColor placeholder:text-zinc-700/50 font-popinsRegular"
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-between mt-4">
        <div className="w-full lg:w-[49%]">
          <LabelTag name="Create Password*" />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password here.."
              className="w-full mt-1 bg-bgColor px-3 py-2 text-sm rounded-full text-darkColor placeholder:text-zinc-700/50 font-popinsRegular"
            />
            <div
              title="Show password"
              className="absolute right-3 top-3 text-stone-950/40 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[49%] mt-4 lg:mt-0">
          <LabelTag name="Confirm Password" />
          <div className="relative">
            <input
              type={confirmShowPassword ? "text" : "password"}
              placeholder="Confirm password here.."
              className="w-full mt-1 bg-bgColor px-3 py-2 text-sm rounded-full text-darkColor placeholder:text-zinc-700/50 font-popinsRegular"
            />
            <div
              title="Show password"
              className="absolute right-3 top-3 text-stone-950/40 cursor-pointer"
              onClick={toggleConfirmPasswordVisibility}
            >
              {confirmShowPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          </div>
        </div>
      </div>
      <div>
        <ButtonTag
          name="Create Account"
          classes="text-base bg-btnColor hover:bg-btnColor/90 mt-5 text-center  text-white"
        />
      </div>
      <div className="font-HelveticaNeueRegular text-darkColor/60 text-sm text-center pt-2">
        <p>
          Don&apos;t have an account ?{" "}
          <Link to={"/"} className="font-HelveticaNeueMedium text-darkColor  ">
            Login
          </Link>
        </p>
      </div>
    </form>
  );
};

export default FormSection;
