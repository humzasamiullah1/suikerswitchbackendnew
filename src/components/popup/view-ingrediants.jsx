import React from "react";

import { CircleX } from "lucide-react";

import { Link } from "react-router-dom";

const ViewIngrediants = ({ data, onClose }) => {
  console.log("data", data);

  return (
    <main className="w-full h-screen backdrop-blur-xs bg-black/80 fixed inset-0 z-50 flex items-center justify-center">
      <section className="w-[90%] sm:w-[65%] md:w-[50%] lg:w-[40%] xl:w-[30%] bg-texture myshades rounded-[31px] mx-auto">
        <div class="bg-white py-8 lg:py-5 rounded-xl justify-center items-center flex flex-col">
          <div className="flex justify-center w-[90%] pb-2 mx-auto border-b-2 border-gray-100 relative">
            <h1 className="font-HelveticaNeueMedium text-center text-darkColor text-lg">
              Manu Deal
            </h1>
            <div
              className="absolute top-[-10px] right-[-10px] cursor-pointer"
              onClick={onClose}
            >
              <CircleX />
            </div>
          </div>
          <div className="w-[95%] mx-auto mt-2">
            <img
              src={data.recipe.image}
              alt=""
              className="w-full h-[150px] object-cover rounded-md"
            />
            <p className="font-HelveticaNeueMedium text-base line-clamp-2 pt-4">
              {data.category}
            </p>
            <Link
              to={`/dashboard/recipes-detail/${data.recipe.id}`}
              className="font-HelveticaNeueMedium py-2 text-base line-clamp-2 hover:text-gkRedColor"
            >
              {data.recipe.description}
            </Link>
            {data.ingredients.map((item, index) => (
              <div className="pl-5 mt-1">
                <ul className="font-HelveticaNeueRegular text-darkColor/80 list-disc">
                  <li>{item}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ViewIngrediants;
