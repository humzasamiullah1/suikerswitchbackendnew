import React from "react";
import ImageTag from "../reuseable/imageTag";

const NoData = () => {
  return (
    <div className="flex flex-col items-center w-full justify-center mt-10">
      <ImageTag
        path="/assets/images/nodata.png"
        classes="w-[50px]"
        altText="login"
      />
      <p className="text-center text-gray-500 w-full mt-2">No Data Found</p>
    </div>
  );
};

export default NoData;
