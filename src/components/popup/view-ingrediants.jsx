import React from "react";

import { CircleX } from "lucide-react";

const ViewIngrediants = ({ data, onClose }) => {
  console.log("data", data);

  return (
    <main className="w-full h-screen backdrop-blur-xs bg-black/80 fixed inset-0 z-50 flex items-center justify-center">
      <section className="w-[90%] sm:w-[65%] md:w-[50%] lg:w-[40%] xl:w-[30%] bg-texture myshades rounded-[31px] mx-auto">
        <div class="bg-white py-8 lg:py-5 rounded-xl justify-center items-center flex flex-col">
          <div className="flex justify-center w-[90%] pb-2 mx-auto border-b-2 border-gray-100 relative">
            <h1 className="font-HelveticaNeueMedium text-center text-darkColor text-base">
              View Ingrediants
            </h1>
            <div className="absolute top-[-10px] right-[-10px] cursor-pointer" onClick={onClose}>
              <CircleX />
            </div>
          </div>
          <div className="w-[95%] lg:w-[90%] mx-auto mt-2">
            {data.map((item, index) => (
              <div className="flex w-full mt-1">
                <p>{index + 1}.</p>
                <p className="font-HelveticaNeueRegular pl-2">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ViewIngrediants;
