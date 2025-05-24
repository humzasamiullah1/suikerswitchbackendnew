import React, { useEffect, useState, useRef } from "react";
import ImageTag from "../../components/reuseable/imageTag";
import { Ellipsis, Trash2, Pencil, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const MenuCard = ({ data, onDelete, hideuserdata }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Function to toggle menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="border-2 border-gray-200 rounded-xl w-full px-4 py-3 mt-3">
      <div className="border-b-2 border-darkColor/20 pb-3 mb-3">
        <div className="flex justify-between items-center">
          <div
            className={`w-[60%] flex items-center font-HelveticaNeueMedium text-lg`}
          >
            <p>{data.title}</p>
          </div>
          {!hideuserdata && (
            <div
              className="w-[40%] flex justify-end text-darkColor relative"
              ref={dropdownRef}
            >
              <Ellipsis
                size={30}
                className="cursor-pointer"
                onClick={toggleMenu}
              />
              {isOpen && (
                <div className="absolute z-20 right-[-10px] top-[18px] mt-2 w-28 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 font-popinsMedium text-sm px-2">
                  <ul className="py-2 w-full">
                    <Link to={`/dashboard/add-weekly-menu?id=${data?.id}`}>
                      <li className="text-darkColor pb-1 font-HelveticaNeueMedium cursor-pointer flex items-center hover:bg-gkRedColor hover:text-white rounded-md px-1 py-1">
                        <Pencil size={18} />
                        <span className="pl-3">Edit</span>
                      </li>
                    </Link>
                    <div className="h-[1px] w-full bg-gray-300 my-[6px]"></div>
                    <li
                      className="cursor-pointer w-full px-1 py-1 flex items-center text-darkColor hover:bg-gkRedColor hover:text-white font-HelveticaNeueMedium rounded-md"
                      onClick={onDelete}
                    >
                      <Trash2 size={18} />
                      <span className="pl-3">Delete</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Link to={`/dashboard/weekly-menu-detail/${data?.id}`}>
        <ImageTag
          path={data?.images[0]}
          classes="w-full h-60 rounded-2xl object-cover"
          altText="logo"
        />
      </Link>
      <div className="my-5 h-[350px] overflow-y-scroll panelScroll">
        {data.WeeklyMenu.Maandag.length > 0 && (
          <div>
            <h3 className="font-HelveticaNeueMedium text-lg  md:text-xl">
              Maandag
            </h3>
            <hr />
            {data.WeeklyMenu.Maandag.map((item, index) => (
              <Link
                to={`/dashboard/recipes-detail/${item.recipe?.id}`}
                className="flex justify-between mt-4 cursor-pointer"
              >
                <div className="flex justify-between items-center w-full border border-gray-200 rounded-md p-2 lg:p-4 shadow">
                  <div className="w-[25%] sm:w-[20%] xl:w-[15%]">
                    <img
                      src={item.recipe?.image[0]}
                      alt=""
                      className="w-full sm:h-[70px] md:h-[80px] lg:w-[240px] lg:h-[90px] object-cover rounded-md"
                    />
                  </div>
                  <div className="w-[66%] sm:w-[70%] xl:w-[80%] pl-2 lg:pl-5">
                    <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2 text-darkColor/60">
                      {item.category}
                    </p>
                    <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2 ">
                      {item.recipe?.description}
                    </p>
                  </div>
                  <div className="w-[8%] flex justify-end">
                    <ChevronRight className="cursor-pointer" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {data.WeeklyMenu.Dinsdag.length > 0 && (
          <div className="mt-6">
            <h3 className="font-HelveticaNeueMedium text-xl">Dinsdag</h3>
            <hr />
            {data.WeeklyMenu.Dinsdag.map((item, index) => (
              <Link
                to={`/dashboard/recipes-detail/${item.recipe?.id}`}
                className="flex justify-between mt-4 cursor-pointer"
              >
                <div className="flex justify-between items-center w-full border border-gray-200 rounded-md p-4 shadow">
                  <div className="w-[15%]">
                    <img
                      src={item.recipe?.image[0]}
                      alt=""
                      className="w-[240px] h-[90px] object-cover rounded-md"
                    />
                  </div>
                  <div className="w-[80%] pl-5">
                    <p className="font-HelveticaNeueMedium text-base line-clamp-2 text-darkColor/60">
                      {item.category}
                    </p>
                    <p className="font-HelveticaNeueMedium text-base line-clamp-2 ">
                      {item.recipe?.description}
                    </p>
                  </div>
                  <div className="w-[5%] flex justify-end">
                    <ChevronRight className="cursor-pointer" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {data.WeeklyMenu.Woensdag.length > 0 && (
          <div className="mt-6">
            <h3 className="font-HelveticaNeueMedium text-xl">Woensdag</h3>
            <hr />
            {data.WeeklyMenu.Woensdag.map((item, index) => (
              <Link
                to={`/dashboard/recipes-detail/${item.recipe?.id}`}
                className="flex justify-between mt-4 cursor-pointer"
              >
                <div className="flex justify-between items-center w-full border border-gray-200 rounded-md p-4 shadow">
                  <div className="w-[15%]">
                    <img
                      src={item.recipe?.image[0]}
                      alt=""
                      className="w-[240px] h-[90px] object-cover rounded-md"
                    />
                  </div>
                  <div className="w-[80%] pl-5">
                    <p className="font-HelveticaNeueMedium text-base line-clamp-2 text-darkColor/60">
                      {item.category}
                    </p>
                    <p className="font-HelveticaNeueMedium text-base line-clamp-2 ">
                      {item.recipe?.description}
                    </p>
                  </div>
                  <div className="w-[5%] flex justify-end">
                    <ChevronRight className="cursor-pointer" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {data.WeeklyMenu.Donderdag.length > 0 && (
          <div className="mt-6">
            <h3 className="font-HelveticaNeueMedium text-xl">Donderdag</h3>
            <hr />
            {data.WeeklyMenu.Donderdag.map((item, index) => (
              <Link
                to={`/dashboard/recipes-detail/${item.recipe?.id}`}
                className="flex justify-between mt-4 cursor-pointer"
              >
                <div className="flex justify-between items-center w-full border border-gray-200 rounded-md p-4 shadow">
                  <div className="w-[15%]">
                    <img
                      src={item.recipe?.image[0]}
                      alt=""
                      className="w-[240px] h-[90px] object-cover rounded-md"
                    />
                  </div>
                  <div className="w-[80%] pl-5">
                    <p className="font-HelveticaNeueMedium text-base line-clamp-2 text-darkColor/60">
                      {item.category}
                    </p>
                    <p className="font-HelveticaNeueMedium text-base line-clamp-2">
                      {item.recipe?.description}
                    </p>
                  </div>
                  <div className="w-[5%] flex justify-end">
                    <ChevronRight className="cursor-pointer" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {data.WeeklyMenu.Vrijdag.length > 0 && (
          <div className="mt-6">
            <h3 className="font-HelveticaNeueMedium text-xl">Vrijdag</h3>
            <hr />
            {data.WeeklyMenu.Vrijdag.map((item, index) => (
              <Link
                to={`/dashboard/recipes-detail/${item.recipe?.id}`}
                className="flex justify-between mt-4 cursor-pointer"
              >
                <div className="flex justify-between items-center w-full border border-gray-200 rounded-md p-4 shadow">
                  <div className="w-[15%]">
                    <img
                      src={item.recipe?.image[0]}
                      alt=""
                      className="w-[240px] h-[90px] object-cover rounded-md"
                    />
                  </div>
                  <div className="w-[80%] pl-5">
                    <p className="font-HelveticaNeueMedium text-base line-clamp-2 text-darkColor/60">
                      {item.category}
                    </p>
                    <p className="font-HelveticaNeueMedium text-base line-clamp-2">
                      {item.recipe?.description}
                    </p>
                  </div>
                  <div className="w-[5%] flex justify-end">
                    <ChevronRight className="cursor-pointer" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {data.WeeklyMenu.Zaterdag.length > 0 && (
          <div className="mt-6">
            <h3 className="font-HelveticaNeueMedium text-xl">Zaterdag</h3>
            <hr />
            {data.WeeklyMenu.Zaterdag.map((item, index) => (
              <Link
                to={`/dashboard/recipes-detail/${item.recipe?.id}`}
                className="flex justify-between mt-4 cursor-pointer"
              >
                <div className="flex justify-between items-center w-full border border-gray-200 rounded-md p-4 shadow">
                  <div className="w-[15%]">
                    <img
                      src={item.recipe?.image[0]}
                      alt=""
                      className="w-[240px] h-[90px] object-cover rounded-md"
                    />
                  </div>
                  <div className="w-[80%] pl-5">
                    <p className="font-HelveticaNeueMedium text-base line-clamp-2 text-darkColor/60">
                      {item.category}
                    </p>
                    <p className="font-HelveticaNeueMedium text-base line-clamp-2 ">
                      {item.recipe?.description}
                    </p>
                  </div>
                  <div className="w-[5%] flex justify-end">
                    <ChevronRight className="cursor-pointer" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {data.WeeklyMenu.Zondag.length > 0 && (
          <div className="mt-6">
            <h3 className="font-HelveticaNeueMedium text-xl">Zondag</h3>
            <hr />
            {data.WeeklyMenu.Zondag.map((item, index) => (
              <Link
                to={`/dashboard/recipes-detail/${item.recipe?.id}`}
                className="flex justify-between mt-4 cursor-pointer"
              >
                <div className="flex justify-between items-center w-full border border-gray-200 rounded-md p-4 shadow">
                  <div className="w-[15%]">
                    <img
                      src={item.recipe?.image[0]}
                      alt=""
                      className="w-[240px] h-[90px] object-cover rounded-md"
                    />
                  </div>
                  <div className="w-[80%] pl-5">
                    <p className="font-HelveticaNeueMedium text-base line-clamp-2 text-darkColor/60">
                      {item.category}
                    </p>
                    <p className="font-HelveticaNeueMedium text-base line-clamp-2">
                      {item.recipe?.description}
                    </p>
                  </div>
                  <div className="w-[5%] flex justify-end">
                    <ChevronRight className="cursor-pointer" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
