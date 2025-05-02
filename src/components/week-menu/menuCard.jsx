import React, { useEffect, useState, useRef } from "react";
import ImageTag from "../../components/reuseable/imageTag";
import {
  Ellipsis,
  Trash2,
  Pencil,
} from "lucide-react";
import { Link } from "react-router-dom";

const MenuCard = ({ data, onDelete, onViewIngrediant }) => {
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
    <div className="border-2 border-gray-200 rounded-xl w-full px-4 py-3 mt-3 h-[600px] overflow-hidden">
      <div className="border-b-2 border-darkColor/20 pb-3 mb-3">
        <div className="flex justify-between items-center">
          <div className={`w-[60%] flex items-center font-HelveticaNeueMedium text-lg`}>
            <p>{data.title}</p></div>
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
              <div className="absolute z-20 right-[-10px] top-[18px] mt-2 w-28 bg-black rounded-lg shadow-lg overflow-hidden transition-all duration-300 font-popinsMedium text-sm">
                <ul className="py-2 pl-4 w-full">
                  <Link to={`/dashboard/add-weekly-menu?id=${data.id}`}>
                    <li className=" text-white border-b border-gray-200 pb-2 font-HelveticaNeueMedium cursor-pointer flex items-center">
                      <Pencil size={18} />
                      <span className="pl-3">Edit</span>
                    </li>
                  </Link>

                  <li
                    className="cursor-pointer pt-2 w-full flex items-center text-white font-HelveticaNeueMedium"
                    onClick={onDelete}
                  >
                    <Trash2 size={18} />
                    <span className="pl-3">Delete</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <Link to={`/dashboard/weekly-menu-detail/${data.id}`}>
        <ImageTag
          path={data.images[0]}
          classes="w-full h-60 rounded-2xl object-cover"
          altText="logo"
        />
      </Link>
      <div className="my-5">
        {data.WeeklyMenu.Maandag.length > 0 && (
          <div>
            <h3 className="font-HelveticaNeueMedium text-xl">Maandag</h3>
            <hr />
            {data.WeeklyMenu.Maandag.map((item, index) => (
              <div className="flex justify-between mt-3">
                <div className="w-[6%] font-HelveticaNeueMedium text-sm">
                  {index + 1}.
                </div>
                <div className="flex w-[37%]">
                  <p className="font-HelveticaNeueMedium text-sm">Category:</p>
                  <p className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1">
                    {item.category}
                  </p>
                </div>
                <div className="flex w-[37%]">
                  <p className="font-HelveticaNeueMedium text-sm">Recipe:</p>
                  <Link
                    to={`/dashboard/recipes-detail/${item.recipe.id}`}
                    className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1 hover:text-gkRedColor"
                  >
                    {item.recipe.description}
                  </Link>
                </div>
                <div className="w-[20%] text-end">
                  <p className="font-HelveticaNeueMedium cursor-pointer text-sm" onClick={() => onViewIngrediant(item.ingredients)}>
                    View Ingrediants
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {data.WeeklyMenu.Dinsdag.length > 0 && (
          <div>
            <h3 className="font-HelveticaNeueMedium text-xl">Dinsdag</h3>
            <hr />
            {data.WeeklyMenu.Dinsdag.map((item, index) => (
              <div className="flex justify-between mt-3">
                <div className="w-[6%] font-HelveticaNeueMedium text-sm">
                  {index + 1}.
                </div>
                <div className="flex w-[37%]">
                  <p className="font-HelveticaNeueMedium text-sm">Category:</p>
                  <p className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1">
                    {item.category}
                  </p>
                </div>
                <div className="flex w-[37%]">
                  <p className="font-HelveticaNeueMedium text-sm">Recipe:</p>
                  <Link
                    to={`/dashboard/recipes-detail/${item.recipe.id}`}
                    className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1 hover:text-gkRedColor"
                  >
                    {item.recipe.description}
                  </Link>
                </div>
                <div className="w-[20%] text-end">
                  <p className="font-HelveticaNeueMedium cursor-pointer text-sm" onClick={() => onViewIngrediant(item.ingredients)}>
                    View Ingrediants
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {data.WeeklyMenu.Woensdag.length > 0 && (
          <div>
            <h3 className="font-HelveticaNeueMedium text-xl">Woensdag</h3>
            <hr />
            {data.WeeklyMenu.Woensdag.map((item, index) => (
              <div className="flex justify-between mt-3">
                <div className="w-[6%] font-HelveticaNeueMedium text-sm">
                  {index + 1}.
                </div>
                <div className="flex w-[37%]">
                  <p className="font-HelveticaNeueMedium text-sm">Category:</p>
                  <p className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1">
                    {item.category}
                  </p>
                </div>
                <div className="flex w-[37%]">
                  <p className="font-HelveticaNeueMedium text-sm">Recipe:</p>
                  <Link
                    to={`/dashboard/recipes-detail/${item.recipe.id}`}
                    className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1 hover:text-gkRedColor"
                  >
                    {item.recipe.description}
                  </Link>
                </div>
                <div className="w-[20%] text-end">
                  <p className="font-HelveticaNeueMedium cursor-pointer text-sm" onClick={() => onViewIngrediant(item.ingredients)}>
                    View Ingrediants
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {data.WeeklyMenu.Donderdag.length > 0 && (
          <div>
            <h3 className="font-HelveticaNeueMedium text-xl">Donderdag</h3>
            <hr />
            {data.WeeklyMenu.Donderdag.map((item, index) => (
              <div className="flex justify-between mt-3">
                <div className="w-[6%] font-HelveticaNeueMedium text-sm">
                  {index + 1}.
                </div>
                <div className="flex w-[37%]">
                  <p className="font-HelveticaNeueMedium text-sm">Category:</p>
                  <p className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1">
                    {item.category}
                  </p>
                </div>
                <div className="flex w-[37%]">
                  <p className="font-HelveticaNeueMedium text-sm">Recipe:</p>
                  <Link
                    to={`/dashboard/recipes-detail/${item.recipe.id}`}
                    className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1 hover:text-gkRedColor"
                  >
                    {item.recipe.description}
                  </Link>
                </div>
                <div className="w-[20%] text-end">
                  <p className="font-HelveticaNeueMedium cursor-pointer text-sm" onClick={() => onViewIngrediant(item.ingredients)}>
                    View Ingrediants
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {data.WeeklyMenu.Vrijdag.length > 0 && (
          <div>
            <h3 className="font-HelveticaNeueMedium text-xl">Vrijdag</h3>
            <hr />
            {data.WeeklyMenu.Vrijdag.map((item, index) => (
              <div className="flex justify-between mt-3">
                <div className="w-[6%] font-HelveticaNeueMedium text-sm">
                  {index + 1}.
                </div>
                <div className="flex w-[37%]">
                  <p className="font-HelveticaNeueMedium text-sm">Category:</p>
                  <p className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1">
                    {item.category}
                  </p>
                </div>
                <div className="flex w-[37%]">
                  <p className="font-HelveticaNeueMedium text-sm">Recipe:</p>
                  <Link
                    to={`/dashboard/recipes-detail/${item.recipe.id}`}
                    className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1 hover:text-gkRedColor"
                  >
                    {item.recipe.description}
                  </Link>
                </div>
                <div className="w-[20%] text-end">
                  <p className="font-HelveticaNeueMedium cursor-pointer text-sm" onClick={() => onViewIngrediant(item.ingredients)}>
                    View Ingrediants
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {data.WeeklyMenu.Zaterdag.length > 0 && (
          <div>
            <h3 className="font-HelveticaNeueMedium text-xl">Zaterdag</h3>
            <hr />
            {data.WeeklyMenu.Zaterdag.map((item, index) => (
              <div className="flex justify-between mt-3">
                <div className="w-[6%] font-HelveticaNeueMedium text-sm">
                  {index + 1}.
                </div>
                <div className="flex w-[37%]">
                  <p className="font-HelveticaNeueMedium text-sm">Category:</p>
                  <p className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1">
                    {item.category}
                  </p>
                </div>
                <div className="flex w-[37%]">
                  <p className="font-HelveticaNeueMedium text-sm">Recipe:</p>
                  <Link
                    to={`/dashboard/recipes-detail/${item.recipe.id}`}
                    className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1 hover:text-gkRedColor"
                  >
                    {item.recipe.description}
                  </Link>
                </div>
                <div className="w-[20%] text-end">
                  <p className="font-HelveticaNeueMedium cursor-pointer text-sm" onClick={() => onViewIngrediant(item.ingredients)}>
                    View Ingrediants
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {data.WeeklyMenu.Zondag.length > 0 && (
          <div>
            <h3 className="font-HelveticaNeueMedium text-xl">Zondag</h3>
            <hr />
            {data.WeeklyMenu.Zondag.map((item, index) => (
              <div className="flex justify-between mt-3">
                <div className="w-[6%] font-HelveticaNeueMedium text-sm">
                  {index + 1}.
                </div>
                <div className="flex w-[37%]">
                  <p className="font-HelveticaNeueMedium text-sm">Category:</p>
                  <p className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1">
                    {item.category}
                  </p>
                </div>
                <div className="flex w-[37%]">
                  <p className="font-HelveticaNeueMedium text-sm">Recipe:</p>
                  <Link
                    to={`/dashboard/recipes-detail/${item.recipe.id}`}
                    className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1 hover:text-gkRedColor"
                  >
                    {item.recipe.description}
                  </Link>
                </div>
                <div className="w-[20%] text-end">
                  <p className="font-HelveticaNeueMedium cursor-pointer text-sm" onClick={() => onViewIngrediant(item.ingredients)}>
                    View Ingrediants
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
