import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
  getRecipeById,
  deleteRecipe,
  fetchUserById,
} from "../../components/utils/firebasefunctions";
import WarningPopup from "../popup/warning";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumbs from "../reuseable/breadCrumbs";

const commentsData = [
  {
    id: 1,
    name: "Olivia Martin",
    time: "1m ago",
    avatar: "https://via.placeholder.com/40",
    content:
      "How Ketchup Revolutionized How Food Is Grown, Processed and Regulated | Smithsonian and typesetting industry. How Ketchup Revolutionized How Food Is Grown, Processed and Regulated | Smithsonian and typesetting industry.",
  },
  {
    id: 2,
    name: "Olivia Martin",
    time: "1m ago",
    avatar: "https://via.placeholder.com/40",
    content:
      "How Ketchup Revolutionized How Food Is Grown, Processed and Regulated | Smithsonian and typesetting industry.",
  },
];

const MainRecipiesDetail = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const [comments, setComments] = useState(commentsData);
  const [isLikePopup, setIsLikePopup] = useState(false);
  const [isCommentPopup, setIsCommentPopup] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [warning, setWarning] = useState(false);
  const [onDeleteId, setOnDeleteId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    dob: "",
    phoneNumber: "",
    email: "",
    profilePicture: "",
  });

  const { id } = useParams(); // URL se id get krni
  const [recipe, setRecipe] = useState(null);


  const fetchRecipe = async () => {
    if (!id) return;

    const blogData = await getRecipeById(id); // Function call
    setRecipe(blogData);
    fetchUserData(blogData.userId);
    console.log("recipe", recipe);
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchUserData = async (userId) => {
    if (!userId) return;

    const userData = await fetchUserById(userId);
    console.log("userData", userData);

    if (userData) {
      setUserData({
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        dob: userData.dob || "",
        phoneNumber: userData.phoneNumber || "",
        email: userData.email || "",
        profilePicture: userData.profilePicture || "",
      });
      setIsLoading(true);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAddComment = () => {
    if (commentText.trim() === "") return;
    const newComment = {
      id: Date.now(),
      name: "You",
      time: "Just now",
      avatar: "https://via.placeholder.com/40",
      content: commentText,
    };
    setComments([...comments, newComment]);
    setCommentText("");
  };

  const timeAgo = (timestamp) => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diffInSeconds = Math.floor((now - createdAt) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  };

  const openConfirmPopup = (id) => {
    setOnDeleteId(id);
    setWarning(true);
  };

  const handleDelete = async (id) => {
    await deleteRecipe(id);
    setWarning(false);
    toast.success("Recipe Deleted Successfully");
    setTimeout(() => {
      navigate("/dashboard/recipies");
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
              link={"/dashboard/recipies"}
              firstLink="Recipies"
              secondLink="Add Recipies"
            />
            <p className="font-HelveticaNeueMedium text-darkColor text-lg">
              Recipes Detail
            </p>
          </div>

          <motion.div
            className="bg-gkRedColor md:hidden size-10 rounded-full text-white flex justify-center items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus size={20} />
          </motion.div>
        </div>
        <div className="flex items-center lg:w-[70%] xl:w-[50%] justify-end">
          <div className="flex items-center gap-2 mt-3 md:mt-0">
            <motion.button
              className="border hidden rounded-full px-4 w-full py-2 md:flex items-center font-HelveticaNeueRegular text-white bg-gkRedColor hover:bg-gkRedColor/90"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="text-sm pr-3">Add New Recipes</p>
              <CircleArrowDown className="h-4 w-4" />
            </motion.button>
          </div>
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
            <div className="flex justify-between items-center border-b border-darkColor/20 py-3 px-2">
              <div className="w-[60%] flex items-center">
                {loading && (
                  <>
                    <ImageTag
                      path={
                        userData.profilePicture !== ""
                          ? userData.profilePicture
                          : "/assets/images/default-image.png"
                      }
                      classes="size-10 rounded-full object-cover"
                      altText="logo"
                    />
                    <div className="pl-3">
                      <p className="font-HelveticaNeueMedium text-darkColor text-base">
                        {userData.firstname} {userData.lastname}
                      </p>
                      <p className="font-HelveticaNeueMedium text-darkColor text-xs">
                        {timeAgo(recipe?.createdAt)}
                      </p>
                    </div>
                  </>
                )}
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
                  <div className="absolute z-20 right-[-10px] top-[18px] mt-2 w-28 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 font-popinsMedium text-sm">
                    <ul className="py-2 pl-4 w-full">
                      <Link to={`/dashboard/add-recipies?id=${recipe.id}`}>
                        <li className=" text-blue-500 border-b border-gray-200 pb-1 font-HelveticaNeueMedium cursor-pointer flex items-center">
                          <Pencil size={18} />
                          <span className="pl-3">Edit</span>
                        </li>
                      </Link>
                      <li
                        className="cursor-pointer pt-2 w-full flex items-center text-red-500 font-HelveticaNeueMedium"
                        onClick={() => openConfirmPopup(recipe.id)}
                      >
                        <Trash2 size={18} />
                        <span className="pl-3">Delete</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div
              className="font-HelveticaNeueRegular text-darkColor text-sm pt-4 px-2"
              dangerouslySetInnerHTML={{ __html: recipe?.content }}
            ></div>
            {recipe?.isLike && (
              <div className="w-[80%] font-HelveticaNeueRegular text-darkColor flex mt-5">
                <div
                  className="flex items-center pr-5 cursor-pointer"
                  onClick={() => {
                    setIsLikePopup(true);
                  }}
                >
                  <ThumbsUp size={18} />
                  <p className="pl-2 text-sm">24 Likes</p>
                </div>
                <div
                  className="flex items-center pr-5"
                  onClick={() => {
                    setIsCommentPopup(true);
                  }}
                >
                  <MessageCircle size={18} />
                  <p className="pl-2 text-sm">20 Comments</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        {recipe?.isLike && (
          <div className="p-4">
            <div className="">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border-b border-gray-200 py-4 space-x-4"
                >
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <ImageTag
                        path="/assets/images/blog.png"
                        classes="size-10"
                        altText="logo"
                      />
                      <div className="pl-3">
                        <h4 className="font-HelveticaNeueMedium text-darkColor">
                          {comment.name}
                        </h4>
                        <p className="text-xs text-darkColor/50 font-HelveticaNeueRegular">
                          {comment.time}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Ellipsis size={25} />
                    </div>
                  </div>

                  <div className="">
                    <p className="text-darkColor text-sm font-HelveticaNeueRegular pt-3">
                      {comment.content}
                    </p>
                    <div className="flex items-center space-x-4 mt-3 text-gray-500">
                      <button className="flex items-center space-x-1 text-darkColor hover:text-blue-500">
                        <ThumbsUp size={22} />
                        <span className="font-HelveticaNeueMedium text-darkColor/90 text-sm pl-1">
                          24 Likes
                        </span>
                      </button>
                      <button className="flex items-center space-x-1 text-darkColor hover:text-blue-500">
                        <Reply size={22} />
                        <span className="font-HelveticaNeueMedium text-darkColor/90 text-sm pl-1">
                          Reply
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center border-t border-gray-200 pt-4 mt-4">
              <ImageTag
                path="/assets/images/blog.png"
                classes="size-10 hidden md:block"
                altText="logo"
              />
              <div className="flex-1 flex items-center md:ml-4 bg-gray-100 rounded-full px-3">
                <input
                  type="text"
                  placeholder="Write your comment..."
                  className="flex-1 py-2 bg-gray-100 rounded-full"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="flex items-center space-x-2 text-gray-500">
                  <Paperclip size={22} />
                </div>
              </div>
              <button
                onClick={handleAddComment}
                className="ml-2 border border-gray-200 text-white p-2 rounded-full"
              >
                <Send size={22} className="text-darkColor" />
              </button>
            </div>
          </div>
        )}
      </div>
      {warning && (
        <WarningPopup
          name="recipies"
          itemId={onDeleteId}
          onClose={() => setWarning(false)}
          onDelete={(id) => handleDelete(id)}
        />
      )}

      {isLikePopup && (
        <LikePopup
          onClose={() => {
            setIsLikePopup(false);
          }}
        />
      )}

      {isCommentPopup && (
        <CommentsPopup
          onClose={() => {
            setIsCommentPopup(false);
          }}
        />
      )}
    </motion.div>
  );
};

export default MainRecipiesDetail;
