import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import {
  CircleArrowDown,
  Plus,
  Ellipsis,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Pencil,
} from "lucide-react";
import ImageTag from "../reuseable/imageTag";
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
  const [warning, setWarning] = useState(false);
  const [onDeleteId, setOnDeleteId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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
            <div className="border-b border-darkColor/20  py-3 px-2 mb-4">
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
                    <div className="absolute z-20 right-[-10px] top-[18px] mt-2 w-28 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 font-popinsMedium text-sm px-2">
                      <ul className="py-2 w-full">
                        <Link to={`/dashboard/add-weekly-menu?id=${menu.id}`}>
                          <li className="text-darkColor pb-1 font-HelveticaNeueMedium cursor-pointer flex items-center hover:bg-gkRedColor hover:text-white rounded-md px-1 py-1">
                            <Pencil size={18} />
                            <span className="pl-3">Edit</span>
                          </li>
                        </Link>
                        <div className="h-[1px] w-full bg-gray-300 my-[6px]"></div>
                        <li
                          className="cursor-pointer w-full px-1 py-1 flex items-center text-darkColor hover:bg-gkRedColor hover:text-white font-HelveticaNeueMedium rounded-md"
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
            <div className="rounded-md">
              <img
                src={menu?.images[0]}
                alt=""
                className="w-full h-60 object-cover rounded-md"
              />
            </div>
            <div className="my-5">
              {menu?.WeeklyMenu?.Maandag.length > 0 && (
                <div>
                  <h3 className="font-HelveticaNeueMedium text-xl">Maandag</h3>
                  <hr />
                  {menu?.WeeklyMenu?.Maandag.map((item, index) => (
                    <>
                      <div className="border border-gray-200 hover:border-gray-300 hover:border-2 rounded-md p-2 lg:p-4 shadow mt-4">
                        {item.recipe?.id !== null ? (
                          <Link
                            to={`/dashboard/recipes-detail/${item.recipe.id}`}
                            className="flex justify-between items-center w-full cursor-pointer"
                          >
                            <div className="w-[25%] sm:w-[20%] xl:w-[15%]">
                              <img
                                src={
                                  item.recipe?.image.length > 0
                                    ? item.recipe?.image[0]
                                    : "/assets/images/default-image.png"
                                }
                                alt=""
                                className="w-full sm:h-[70px] md:h-[80px] lg:w-[240px] lg:h-[100px] object-cover rounded-md"
                              />
                            </div>
                            <div className="w-[58%] sm:w-[68%] xl:w-[78%] pl-2 lg:pl-5">
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2 text-darkColor/60">
                                {item.category}
                              </p>
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2 ">
                                {item.recipe.description}
                              </p>
                            </div>
                            <div className="w-[8%] flex justify-end">
                              <ChevronRight className="cursor-pointer" />
                            </div>
                          </Link>
                        ) : (
                          <div className="flex justify-between items-center w-full">
                            <div className="w-[25%] sm:w-[20%] xl:w-[15%]">
                              <img
                                src={
                                  item.recipe?.image.length > 0
                                    ? item.recipe?.image[0]
                                    : "/assets/images/default-image.png"
                                }
                                alt=""
                                className="w-full sm:h-[78px] md:h-[80px] lg:w-[240px] lg:h-[100px] object-cover rounded-md"
                              />
                            </div>
                            <div className="w-[70%] sm:w-[78%] xl:w-[85%] pl-2 lg:pl-5">
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2 text-darkColor/60">
                                {item.category}
                              </p>
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2 ">
                                {item.recipe.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ))}
                </div>
              )}
              {menu?.WeeklyMenu?.Dinsdag.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-HelveticaNeueMedium text-xl">Dinsdag</h3>
                  <hr />
                  {menu?.WeeklyMenu?.Dinsdag.map((item, index) => (
                    <>
                      <div className="border border-gray-200 hover:border-gray-300 hover:border-2 rounded-md p-2 lg:p-4 shadow">
                        {item.recipe?.id !== null ? (
                          <Link
                            to={`/dashboard/recipes-detail/${item.recipe.id}`}
                            className="flex justify-between items-center w-full"
                          >
                            <div className="w-[25%] sm:w-[20%] xl:w-[15%]">
                              <img
                                src={
                                  item.recipe?.image.length > 0
                                    ? item.recipe?.image[0]
                                    : "/assets/images/default-image.png"
                                }
                                alt=""
                                className="w-full sm:h-[70px] md:h-[80px] lg:w-[240px] lg:h-[100px] object-cover rounded-md"
                              />
                            </div>
                            <div className="w-[58%] sm:w-[68%] xl:w-[78%] pl-2 lg:pl-5">
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2 text-darkColor/60">
                                {item.category}
                              </p>
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2">
                                {item.recipe.description}
                              </p>
                            </div>
                            <div className="w-[8%] flex justify-end">
                              <ChevronRight className="cursor-pointer" />
                            </div>
                          </Link>
                        ) : (
                          <div className="flex justify-between items-center w-full">
                            <div className="w-[25%] sm:w-[20%] xl:w-[15%]">
                              <img
                                src={
                                  item.recipe?.image.length > 0
                                    ? item.recipe?.image[0]
                                    : "/assets/images/default-image.png"
                                }
                                alt=""
                                className="w-full sm:h-[70px] md:h-[80px] lg:w-[240px] lg:h-[100px] object-cover rounded-md"
                              />
                            </div>
                            <div className="w-[70%] sm:w-[78%] xl:w-[85%] pl-2 lg:pl-5">
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2 text-darkColor/60">
                                {item.category}
                              </p>
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2">
                                {item.recipe.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ))}
                </div>
              )}
              {menu?.WeeklyMenu?.Woensdag.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-HelveticaNeueMedium text-xl">Woensdag</h3>
                  <hr />
                  {menu?.WeeklyMenu?.Woensdag.map((item, index) => (
                    <>
                      <div className="border border-gray-200 hover:border-gray-300 hover:border-2 rounded-md p-2 lg:p-4 shadow mt-4">
                        {item.recipe?.id !== null ? (
                          <Link
                            to={`/dashboard/recipes-detail/${item.recipe.id}`}
                            className="flex justify-between items-center w-full"
                          >
                            <div className="w-[25%] sm:w-[20%] xl:w-[15%]">
                              <img
                                src={
                                  item.recipe?.image.length > 0
                                    ? item.recipe?.image[0]
                                    : "/assets/images/default-image.png"
                                }
                                alt=""
                                className="w-full sm:h-[70px] md:h-[80px] lg:w-[240px] lg:h-[100px] object-cover rounded-md"
                              />
                            </div>
                            <div className="w-[58%] sm:w-[68%] xl:w-[78%] pl-2 lg:pl-5">
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2 text-darkColor/60">
                                {item.category}
                              </p>
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2">
                                {item.recipe.description}
                              </p>
                            </div>
                            <div className="w-[8%] flex justify-end">
                              <ChevronRight className="cursor-pointer" />
                            </div>
                          </Link>
                        ) : (
                          <div className="flex justify-between items-center w-full">
                            <div className="w-[25%] sm:w-[20%] xl:w-[15%]">
                              <img
                                src={
                                  item.recipe?.image.length > 0
                                    ? item.recipe?.image[0]
                                    : "/assets/images/default-image.png"
                                }
                                alt=""
                                className="w-full sm:h-[70px] md:h-[80px] lg:w-[240px] lg:h-[100px] object-cover rounded-md"
                              />
                            </div>
                            <div className="w-[70%] sm:w-[78%] xl:w-[85%] pl-2 lg:pl-5">
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2 text-darkColor/60">
                                {item.category}
                              </p>
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2">
                                {item.recipe.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ))}
                </div>
              )}
              {menu?.WeeklyMenu?.Donderdag?.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-HelveticaNeueMedium text-xl">
                    Donderdag
                  </h3>
                  <hr />
                  {menu?.WeeklyMenu?.Donderdag.map((item, index) => (
                    <>
                      <div className="border border-gray-200 hover:border-gray-300 hover:border-2 rounded-md p-2 lg:p-4 shadow mt-4">
                        {item.recipe?.id !== null ? (
                          <Link
                            to={`/dashboard/recipes-detail/${item.recipe.id}`}
                            className="flex justify-between items-center w-full"
                          >
                            <div className="w-[25%] sm:w-[20%] xl:w-[15%]">
                              <img
                                src={
                                  item.recipe?.image.length > 0
                                    ? item.recipe?.image[0]
                                    : "/assets/images/default-image.png"
                                }
                                alt=""
                                className="w-full sm:h-[70px] md:h-[80px] lg:w-[240px] lg:h-[100px] object-cover rounded-md"
                              />
                            </div>
                            <div className="w-[58%] sm:w-[68%] xl:w-[78%] pl-2 lg:pl-5">
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2 text-darkColor/60">
                                {item.category}
                              </p>
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2">
                                {item.recipe.description}
                              </p>
                            </div>
                            <div className="w-[8%] flex justify-end">
                              <ChevronRight className="cursor-pointer" />
                            </div>
                          </Link>
                        ) : (
                          <div className="flex justify-between items-center w-full">
                            <div className="w-[25%] sm:w-[20%] xl:w-[15%]">
                              <img
                                src={
                                  item.recipe?.image.length > 0
                                    ? item.recipe?.image[0]
                                    : "/assets/images/default-image.png"
                                }
                                alt=""
                                className="w-full sm:h-[70px] md:h-[80px] lg:w-[240px] lg:h-[100px] object-cover rounded-md"
                              />
                            </div>
                            <div className="w-[70%] sm:w-[78%] xl:w-[85%] pl-2 lg:pl-5">
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2 text-darkColor/60">
                                {item.category}
                              </p>
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2">
                                {item.recipe.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ))}
                </div>
              )}
              {menu?.WeeklyMenu?.Vrijdag.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-HelveticaNeueMedium text-xl">Vrijdag</h3>
                  <hr />
                  {menu?.WeeklyMenu?.Vrijdag.map((item, index) => (
                    <>
                      <div className="border border-gray-200 hover:border-gray-300 hover:border-2 rounded-md p-2 lg:p-4 shadow mt-4">
                        {item.recipe?.id !== null ? (
                          <Link
                            to={`/dashboard/recipes-detail/${item.recipe.id}`}
                            className="flex justify-between items-center w-full"
                          >
                            <div className="w-[25%] sm:w-[20%] xl:w-[15%]">
                              <img
                                src={
                                  item.recipe?.image.length > 0
                                    ? item.recipe?.image[0]
                                    : "/assets/images/default-image.png"
                                }
                                alt=""
                                className="w-full sm:h-[70px] md:h-[80px] lg:w-[240px] lg:h-[100px] object-cover rounded-md"
                              />
                            </div>
                            <div className="w-[58%] sm:w-[68%] xl:w-[78%] pl-2 lg:pl-5">
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2 text-darkColor/60">
                                {item.category}
                              </p>
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2">
                                {item.recipe.description}
                              </p>
                            </div>
                            <div className="w-[8%] flex justify-end">
                              <ChevronRight className="cursor-pointer" />
                            </div>
                          </Link>
                        ) : (
                          <div className="flex justify-between items-center w-full">
                            <div className="w-[25%] sm:w-[20%] xl:w-[15%]">
                              <img
                                src={
                                  item.recipe?.image.length > 0
                                    ? item.recipe?.image[0]
                                    : "/assets/images/default-image.png"
                                }
                                alt=""
                                className="w-full sm:h-[70px] md:h-[80px] lg:w-[240px] lg:h-[100px] object-cover rounded-md"
                              />
                            </div>
                            <div className="w-[70%] sm:w-[78%] xl:w-[85%] pl-2 lg:pl-5">
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2 text-darkColor/60">
                                {item.category}
                              </p>
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2">
                                {item.recipe.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ))}
                </div>
              )}
              {menu?.WeeklyMenu?.Zaterdag.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-HelveticaNeueMedium text-xl">Zaterdag</h3>
                  <hr />
                  {menu?.WeeklyMenu?.Zaterdag.map((item, index) => (
                    <>
                      <div className="border border-gray-200 hover:border-gray-300 hover:border-2 rounded-md p-2 lg:p-4 shadow mt-4">
                        {item.recipe?.id !== null ? (
                          <Link
                            to={`/dashboard/recipes-detail/${item.recipe.id}`}
                            className="flex justify-between items-center w-full"
                          >
                            <div className="w-[25%] sm:w-[20%] xl:w-[15%]">
                              <img
                                src={
                                  item.recipe?.image.length > 0
                                    ? item.recipe?.image[0]
                                    : "/assets/images/default-image.png"
                                }
                                alt=""
                                className="w-full sm:h-[70px] md:h-[80px] lg:w-[240px] lg:h-[100px] object-cover rounded-md"
                              />
                            </div>
                            <div className="w-[58%] sm:w-[68%] xl:w-[78%] pl-2 lg:pl-5">
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2 text-darkColor/60">
                                {item.category}
                              </p>
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2">
                                {item.recipe.description}
                              </p>
                            </div>
                            <div className="w-[8%] flex justify-end">
                              <ChevronRight className="cursor-pointer" />
                            </div>
                          </Link>
                        ) : (
                          <div className="flex justify-between items-center w-full">
                            <div className="w-[25%] sm:w-[20%] xl:w-[15%]">
                              <img
                                src={
                                  item.recipe?.image.length > 0
                                    ? item.recipe?.image[0]
                                    : "/assets/images/default-image.png"
                                }
                                alt=""
                                className="w-full sm:h-[70px] md:h-[80px] lg:w-[240px] lg:h-[100px] object-cover rounded-md"
                              />
                            </div>
                            <div className="w-[70%] sm:w-[78%] xl:w-[85%] pl-2 lg:pl-5">
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2 text-darkColor/60">
                                {item.category}
                              </p>
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2">
                                {item.recipe.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ))}
                </div>
              )}
              {menu?.WeeklyMenu?.Zondag.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-HelveticaNeueMedium text-xl">Zondag</h3>
                  <hr />
                  {menu?.WeeklyMenu?.Zondag.map((item, index) => (
                    <>
                      <div className="border border-gray-200 hover:border-gray-300 hover:border-2 rounded-md p-2 lg:p-4 shadow mt-4">
                        {item.recipe?.id !== null ? (
                          <Link
                            to={`/dashboard/recipes-detail/${item.recipe.id}`}
                            className="flex justify-between items-center w-full"
                          >
                            <div className="w-[25%] sm:w-[20%] xl:w-[15%]">
                              <img
                                src={
                                  item.recipe?.image.length > 0
                                    ? item.recipe?.image[0]
                                    : "/assets/images/default-image.png"
                                }
                                alt=""
                                className="w-full sm:h-[70px] md:h-[80px] lg:w-[240px] lg:h-[100px] object-cover rounded-md"
                              />
                            </div>
                            <div className="w-[58%] sm:w-[68%] xl:w-[78%] pl-2 lg:pl-5">
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2 text-darkColor/60">
                                {item.category}
                              </p>
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2">
                                {item.recipe.description}
                              </p>
                            </div>
                            <div className="w-[8%] flex justify-end">
                              <ChevronRight className="cursor-pointer" />
                            </div>
                          </Link>
                        ) : (
                          <div className="flex justify-between items-center w-full">
                            <div className="w-[25%] sm:w-[20%] xl:w-[15%]">
                              <img
                                src={
                                  item.recipe?.image.length > 0
                                    ? item.recipe?.image[0]
                                    : "/assets/images/default-image.png"
                                }
                                alt=""
                                className="w-full sm:h-[70px] md:h-[80px] lg:w-[240px] lg:h-[100px] object-cover rounded-md"
                              />
                            </div>
                            <div className="w-[70%] sm:w-[78%] xl:w-[85%] pl-2 lg:pl-5">
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2 text-darkColor/60">
                                {item.category}
                              </p>
                              <p className="font-HelveticaNeueMedium text-sm lg:text-base line-clamp-2">
                                {item.recipe.description}
                              </p>
                            </div>
                          </div>
                        )}
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
