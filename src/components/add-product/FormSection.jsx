import React from "react";
import LabelTag from "../reuseable/label";
import { motion } from "framer-motion";

const FormSection = () => {
  return (
    <form>
      <div className="flex justify-between">
        <div className="w-[49%]">
          <LabelTag name="Product Name" classes="!text-sm" />
          <input
            type="text"
            placeholder="Write Product Name"
            className="w-full mt-1 text-sm font-popinsRegular rounded-md bg-bgColor px-3 py-[10px] text-darkColor placeholder:text-zinc-700/50"
          />
        </div>
        <div className="w-[49%]">
          <LabelTag name="Product Price" classes="!text-sm" />
          <input
            type="text"
            placeholder="Write Product Name"
            className="w-full mt-1 text-sm font-popinsRegular rounded-md bg-bgColor px-3 py-[10px] text-darkColor placeholder:text-zinc-700/50"
          />
        </div>
      </div>
    </form>
  );
};

export default FormSection;
