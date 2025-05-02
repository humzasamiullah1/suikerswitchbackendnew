import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import {
  CircleArrowDown,
  Plus,
  Ellipsis,
  Send,
  Paperclip,
  Reply,
  ThumbsUp,
  MessageCircle,
  Trash2,
  Pencil,
} from "lucide-react";
import ImageTag from "../reuseable/imageTag";
import LikePopup from "../../components/popup/like";
import CommentsPopup from "../../components/popup/comments";
import { useParams } from "react-router-dom";
import {
  getWeeklyMenuById,
  deleteWeeklyMenu,
} from "../../components/utils/firebasefunctions";
import WarningPopup from "../popup/warning";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumbs from "../reuseable/breadCrumbs";

const MainMenuDetail = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [commentText, setCommentText] = useState("");
  const [warning, setWarning] = useState(false);
  const [onDeleteId, setOnDeleteId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const { id } = useParams(); // URL se id get krni
  const [menu, setMenu] = useState(null);

  const fetchMenu = async () => {
    if (!id) return;

    const menuData = await getWeeklyMenuById(id); // Function call
    setMenu(menuData);
    console.log("recipe", menuData);
  };

  useEffect(() => {
    fetchMenu();
  }, [id]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const openConfirmPopup = (id) => {
    setOnDeleteId(id);
    setWarning(true);
  };

  const handleDelete = async (id) => {
    await deleteWeeklyMenu(id);
    setWarning(false);
    toast.success("Menu Deleted Successfully");
    setTimeout(() => {
      navigate("/dashboard/weekly-menu");
    }, 1000);
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
    <motion.div
      className="bg-white rounded-[30px] shadow-md px-5 h-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header Section */}
      <div className="flex lg:flex-row flex-col justify-between items-center pt-5 lg:h-[12%]">
        <div className="flex justify-between w-full items-center lg:w-[30%] xl:w-[50%]">
          <div>
            <BreadCrumbs
              link={"/dashboard/weekly-menu"}
              firstLink="Weekly Menu"
              secondLink="Weekly Menu Detail"
            />
            <p className="font-HelveticaNeueMedium text-darkColor text-lg">
              Weekly Menu Detail
            </p>
          </div>
          <Link to={"/dashboard/add-weekly-menu"}>
            <motion.div
              className="bg-gkRedColor md:hidden size-10 rounded-full text-white flex justify-center items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus size={20} />
            </motion.div>
          </Link>
        </div>
        <div className="flex items-center lg:w-[70%] xl:w-[50%] justify-end">
          <Link to={"/dashboard/add-weekly-menu"}>
            <motion.button
              className="border hidden rounded-full px-4 w-full py-2 md:flex items-center font-HelveticaNeueRegular text-white bg-gkRedColor hover:bg-gkRedColor/90"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="text-sm pr-3">Add New Weekly Menu</p>
              <CircleArrowDown className="h-4 w-4" />
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Blog List Section */}
      <div className="lg:h-[88%] lg:overflow-y-scroll panelScroll">
        <motion.div
          className=""
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 1 * 0.1 }}
          viewport={{ once: true }}
        >
          <div className=" mt-2">
            <div className="border-b border-darkColor/20  py-3 px-2">
              <div className="flex justify-between items-center">
                <div className="w-[60%] flex items-center">
                  <p className="font-HelveticaNeueMedium text-lg">
                    {menu?.title}
                  </p>
                </div>
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
                        <Link to={`/dashboard/add-weekly-menu?id=${menu.id}`}>
                          <li className=" text-white border-b border-gray-200 pb-1 font-HelveticaNeueMedium cursor-pointer flex items-center">
                            <Pencil size={18} />
                            <span className="pl-3">Edit</span>
                          </li>
                        </Link>
                        <li
                          className="cursor-pointer pt-2 w-full flex items-center text-white font-HelveticaNeueMedium"
                          onClick={() => openConfirmPopup(menu.id)}
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
            <ImageTag
              path={menu?.images[0]}
              classes="w-full h-60 rounded-2xl object-cover"
              altText="logo"
            />
            <div className="my-5">
              {menu?.WeeklyMenu?.Maandag.length > 0 && (
                <div>
                  <h3 className="font-HelveticaNeueMedium text-xl">Maandag</h3>
                  <hr />
                  {menu?.WeeklyMenu?.Maandag.map((item, index) => (
                    <>
                      <h4 className="font-HelveticaNeueMedium text-base mt-4">
                        Menu {index + 1}.
                      </h4>
                      <div className="flex justify-between mt-3">
                        <div className="flex w-[49%]">
                          <p className="font-HelveticaNeueMedium text-sm">
                            Category:
                          </p>
                          <p className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1">
                            {item?.category}
                          </p>
                        </div>
                        <div className="flex w-[49%]">
                          <p className="font-HelveticaNeueMedium text-sm">
                            Recipe:
                          </p>
                          <Link
                            to={`/dashboard/recipes-detail/${item?.recipe?.id}`}
                            className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1 hover:text-gkRedColor"
                          >
                            {item?.recipe?.description}
                          </Link>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h4 className="font-HelveticaNeueMedium text-base">
                          Ingrediants
                        </h4>
                        {item.ingredients.map((ing, i) => (
                          <div className="flex mt-2">
                            <p className="font-HelveticaNeueMedium text-sm">
                              {i + 1}.
                            </p>
                            <p className="font-HelveticaNeueMedium text-sm">
                              {ing}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ))}
                </div>
              )}
              {menu?.WeeklyMenu?.Dinsdag.length > 0 && (
                <div>
                  <h3 className="font-HelveticaNeueMedium text-xl">Dinsdag</h3>
                  <hr />
                  {menu?.WeeklyMenu?.Dinsdag.map((item, index) => (
                    <>
                      <h4 className="font-HelveticaNeueMedium text-base mt-4">
                        Menu {index + 1}.
                      </h4>
                      <div className="flex justify-between mt-3">
                        <div className="flex w-[49%]">
                          <p className="font-HelveticaNeueMedium text-sm">
                            Category:
                          </p>
                          <p className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1">
                            {item?.category}
                          </p>
                        </div>
                        <div className="flex w-[49%]">
                          <p className="font-HelveticaNeueMedium text-sm">
                            Recipe:
                          </p>
                          <Link
                            to={`/dashboard/recipes-detail/${item?.recipe?.id}`}
                            className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1 hover:text-gkRedColor"
                          >
                            {item?.recipe?.description}
                          </Link>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h4 className="font-HelveticaNeueMedium text-base">
                          Ingrediants
                        </h4>
                        {item.ingredients.map((ing, i) => (
                          <div className="flex mt-2">
                            <p className="font-HelveticaNeueMedium text-sm">
                              {i + 1}.
                            </p>
                            <p className="font-HelveticaNeueMedium text-sm">
                              {ing}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ))}
                </div>
              )}
              {menu?.WeeklyMenu?.Woensdag.length > 0 && (
                <div>
                  <h3 className="font-HelveticaNeueMedium text-xl">Woensdag</h3>
                  <hr />
                  {menu?.WeeklyMenu?.Woensdag.map((item, index) => (
                    <>
                      <h4 className="font-HelveticaNeueMedium text-base mt-4">
                        Menu {index + 1}.
                      </h4>
                      <div className="flex justify-between mt-3">
                        <div className="flex w-[49%]">
                          <p className="font-HelveticaNeueMedium text-sm">
                            Category:
                          </p>
                          <p className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1">
                            {item.category}
                          </p>
                        </div>
                        <div className="flex w-[49%]">
                          <p className="font-HelveticaNeueMedium text-sm">
                            Recipe:
                          </p>
                          <Link
                            to={`/dashboard/recipes-detail/${item?.recipe?.id}`}
                            className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1 hover:text-gkRedColor"
                          >
                            {item?.recipe?.description}
                          </Link>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h4 className="font-HelveticaNeueMedium text-base">
                          Ingrediants
                        </h4>
                        {item.ingredients.map((ing, i) => (
                          <div className="flex mt-2">
                            <p className="font-HelveticaNeueMedium text-sm">
                              {i + 1}.
                            </p>
                            <p className="font-HelveticaNeueMedium text-sm">
                              {ing}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ))}
                </div>
              )}
              {menu?.WeeklyMenu?.Donderdag?.length > 0 && (
                <div>
                  <h3 className="font-HelveticaNeueMedium text-xl">
                    Donderdag
                  </h3>
                  <hr />
                  {menu?.WeeklyMenu?.Donderdag.map((item, index) => (
                    <>
                      <h4 className="font-HelveticaNeueMedium text-base mt-4">
                        Menu {index + 1}.
                      </h4>
                      <div className="flex justify-between mt-3">
                        <div className="flex w-[49%]">
                          <p className="font-HelveticaNeueMedium text-sm">
                            Category:
                          </p>
                          <p className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1">
                            {item?.category}
                          </p>
                        </div>
                        <div className="flex w-[49%]">
                          <p className="font-HelveticaNeueMedium text-sm">
                            Recipe:
                          </p>
                          <Link
                            to={`/dashboard/recipes-detail/${item?.recipe?.id}`}
                            className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1 hover:text-gkRedColor"
                          >
                            {item?.recipe?.description}
                          </Link>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h4 className="font-HelveticaNeueMedium text-base">
                          Ingrediants
                        </h4>
                        {item.ingredients.map((ing, i) => (
                          <div className="flex mt-2">
                            <p className="font-HelveticaNeueMedium text-sm">
                              {i + 1}.
                            </p>
                            <p className="font-HelveticaNeueMedium text-sm">
                              {ing}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ))}
                </div>
              )}
              {menu?.WeeklyMenu?.Vrijdag.length > 0 && (
                <div>
                  <h3 className="font-HelveticaNeueMedium text-xl">Vrijdag</h3>
                  <hr />
                  {menu?.WeeklyMenu?.Vrijdag.map((item, index) => (
                    <>
                      <h4 className="font-HelveticaNeueMedium text-base mt-4">
                        Menu {index + 1}.
                      </h4>
                      <div className="flex justify-between mt-3">
                        <div className="flex w-[49%]">
                          <p className="font-HelveticaNeueMedium text-sm">
                            Category:
                          </p>
                          <p className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1">
                            {item?.category}
                          </p>
                        </div>
                        <div className="flex w-[49%]">
                          <p className="font-HelveticaNeueMedium text-sm">
                            Recipe:
                          </p>
                          <Link
                            to={`/dashboard/recipes-detail/${item?.recipe?.id}`}
                            className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1 hover:text-gkRedColor"
                          >
                            {item?.recipe?.description}
                          </Link>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h4 className="font-HelveticaNeueMedium text-base">
                          Ingrediants
                        </h4>
                        {item.ingredients.map((ing, i) => (
                          <div className="flex mt-2">
                            <p className="font-HelveticaNeueMedium text-sm">
                              {i + 1}.
                            </p>
                            <p className="font-HelveticaNeueMedium text-sm">
                              {ing}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ))}
                </div>
              )}
              {menu?.WeeklyMenu?.Zaterdag.length > 0 && (
                <div>
                  <h3 className="font-HelveticaNeueMedium text-xl">Zaterdag</h3>
                  <hr />
                  {menu?.WeeklyMenu?.Zaterdag.map((item, index) => (
                    <>
                      <h4 className="font-HelveticaNeueMedium text-base mt-4">
                        Menu {index + 1}.
                      </h4>
                      <div className="flex justify-between mt-3">
                        <div className="flex w-[49%]">
                          <p className="font-HelveticaNeueMedium text-sm">
                            Category:
                          </p>
                          <p className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1">
                            {item?.category}
                          </p>
                        </div>
                        <div className="flex w-[49%]">
                          <p className="font-HelveticaNeueMedium text-sm">
                            Recipe:
                          </p>
                          <Link
                            to={`/dashboard/recipes-detail/${item?.recipe?.id}`}
                            className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1 hover:text-gkRedColor"
                          >
                            {item?.recipe?.description}
                          </Link>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h4 className="font-HelveticaNeueMedium text-base">
                          Ingrediants
                        </h4>
                        {item.ingredients.map((ing, i) => (
                          <div className="flex mt-2">
                            <p className="font-HelveticaNeueMedium text-sm">
                              {i + 1}.
                            </p>
                            <p className="font-HelveticaNeueMedium text-sm">
                              {ing}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ))}
                </div>
              )}
              {menu?.WeeklyMenu?.Zondag.length > 0 && (
                <div>
                  <h3 className="font-HelveticaNeueMedium text-xl">Zondag</h3>
                  <hr />
                  {menu?.WeeklyMenu?.Zondag.map((item, index) => (
                    <>
                      <h4 className="font-HelveticaNeueMedium text-base mt-4">
                        Menu {index + 1}.
                      </h4>
                      <div className="flex justify-between mt-3">
                        <div className="flex w-[49%]">
                          <p className="font-HelveticaNeueMedium text-sm">
                            Category:
                          </p>
                          <p className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1">
                            {item?.category}
                          </p>
                        </div>
                        <div className="flex w-[49%]">
                          <p className="font-HelveticaNeueMedium text-sm">
                            Recipe:
                          </p>
                          <Link
                            to={`/dashboard/recipes-detail/${item?.recipe?.id}`}
                            className="font-HelveticaNeueRegular text-sm pl-2 line-clamp-1 hover:text-gkRedColor"
                          >
                            {item?.recipe?.description}
                          </Link>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h4 className="font-HelveticaNeueMedium text-base">
                          Ingrediants
                        </h4>
                        {item.ingredients.map((ing, i) => (
                          <div className="flex mt-2">
                            <p className="font-HelveticaNeueMedium text-sm">
                              {i + 1}.
                            </p>
                            <p className="font-HelveticaNeueMedium text-sm">
                              {ing}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      {warning && (
        <WarningPopup
          name="menu"
          itemId={onDeleteId}
          onClose={() => setWarning(false)}
          onDelete={(id) => handleDelete(id)}
        />
      )}
    </motion.div>
  );
};

export default MainMenuDetail;
