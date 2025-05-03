import React, { useEffect, useState, useRef } from "react";
import ImageTag from "../../components/reuseable/imageTag";
import { fetchUserById } from "../utils/firebasefunctions";
import {
  Ellipsis,
  Trash2,
  Pencil,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const timeAgo = (timestamp) => {
  if (!timestamp || !timestamp.seconds) return "Invalid date";

  const createdAt = new Date(timestamp.seconds * 1000); // Convert Firebase Timestamp to JavaScript Date
  const now = new Date();
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

const HighlightedText = ({ text, searchTerm }) => {
  if (!searchTerm) return <>{text}</>;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span key={index} style={{ backgroundColor: "yellow" }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

const RecipiesCard = ({
  data,
  onDelete,
  onLikePopup,
  onCommentPopup,
  highlightSearchTerm,
  isShow = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [loading, setIsLoading] = useState(false);

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Start dragging
  const startDrag = (e) => {
    setIsDragging(true);
    const pageX = e.pageX || e.touches[0].pageX;
    setStartX(pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  // Stop dragging
  const stopDrag = () => {
    setIsDragging(false);
  };

  // Handle drag movement
  const handleDrag = (e) => {
    if (!isDragging || !scrollRef.current) return;
    const pageX = e.pageX || e.touches[0].pageX;
    const x = pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Function to toggle menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    dob: "",
    phoneNumber: "",
    email: "",
    profilePicture: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!data?.userId) return;

      const userData = await fetchUserById(data.userId);

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
    fetchUserData();
  }, [data?.userId]);

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
      <div className="border-b-2 border-darkColor/20 pb-3">
        <div className="flex justify-between items-center">
          <div className={`${isShow ? "w-full" : "w-[60%]"} flex items-center`}>
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
                  <p className="font-HelveticaNeueMedium text-darkColor/60 text-xs">
                    {timeAgo(data.createdAt)}
                  </p>
                </div>
              </>
            )}
          </div>
          {isShow && (
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
                    <Link to={`/dashboard/add-recipies?id=${data.id}`}>
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
        <div
          ref={scrollRef}
          className="overflow-x-auto whitespace-nowrap cursor-grab active:cursor-grabbing select-none scrollbar-hide panelScroll"
          onMouseDown={startDrag}
          onMouseMove={handleDrag}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchStart={startDrag}
          onTouchMove={handleDrag}
          onTouchEnd={stopDrag}
        >
          <div className="flex space-x-3 w-max px-4 py-2">
            {data.category.map((item, index) => (
              <div
                key={index}
                className="px-3 py-1 rounded-full bg-gkRedColor font-HelveticaNeueMedium text-white text-sm shrink-0"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Link to={`/dashboard/recipes-detail/${data.id}`}>
        <p className="font-HelveticaNeueRegular text-darkColor text-sm py-4">
          <HighlightedText
            text={data.description}
            searchTerm={highlightSearchTerm}
          />
        </p>
        <ImageTag
          path={data.images}
          classes="w-full h-60 rounded-2xl object-cover"
          altText="logo"
        />
      </Link>
      {data.IsLike && (
        <div className="flex pt-10">
          <div className="w-[20%] flex text-darkColor">
            <ThumbsUp size={20} />
            <MessageCircle size={20} className="ml-6" />
          </div>
          <div className="w-[80%] font-HelveticaNeueRegular text-darkColor flex justify-end">
            <div
              className="flex items-center pr-5 cursor-pointer"
              onClick={onLikePopup}
            >
              <ThumbsUp size={18} />
              <p className="pl-2 text-sm">{data.like} Likes</p>
            </div>
            <div
              className="flex items-center pr-5 cursor-pointer"
              onClick={onCommentPopup}
            >
              <MessageCircle size={18} />
              <p className="pl-2 text-sm">{data.comments} Comments</p>
            </div>
          </div>
          <div>
            <ImageTag
              path="/assets/images/userprofile.png"
              classes="size-8 rounded-full object-cover"
              altText="logo"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipiesCard;
