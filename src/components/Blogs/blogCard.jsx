import React, { useEffect, useState, useRef } from "react";
import ImageTag from "../reuseable/imageTag";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchUserById } from "../utils/firebasefunctions";

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
        part?.toLowerCase() === searchTerm?.toLowerCase() ? (
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

const BlogCard = ({
  data,
  onDelete,
  onLikePopup,
  highlightSearchTerm,
  isShow = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [loading, setIsLoading] = useState(false);

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
    <div className="border-2 border-gray-200 h-[365px] rounded-xl w-full px-4 py-3 mt-3 relative">
      {isShow && (
        <div
          className="bg-gkRedColor rounded-full cursor-pointer flex justify-center items-center w-7 h-7 absolute right-[-7px] top-[-15px]"
          onClick={onDelete}
        >
          <Trash2 className="text-white" size={18} />
        </div>
      )}
      <div className="h-[90%]">
        <Link
          to={`/dashboard/recipes-detail/${data.id}`}
          className="flex justify-center"
        >
          <ImageTag
            path={data?.images}
            classes="w-full h-52 object-cover rounded-lg"
            altText="logo"
          />
        </Link>
        {loading && (
          <>
            <div className="flex mt-3">
              <ImageTag
                path={
                  userData.profilePicture !== ""
                    ? userData.profilePicture
                    : "/assets/images/default-image.png"
                }
                classes="size-9 rounded-full object-cover"
                altText="logo"
              />
              <div className="pl-3">
                <p className="font-HelveticaNeueMedium text-darkColor text-sm">
                  {userData.firstname} {userData.lastname}
                </p>
                <p className="font-HelveticaNeueMedium text-darkColor/60 text-xs">
                  {timeAgo(data.createdAt)}
                </p>
              </div>
            </div>
          </>
        )}
        <Link to={`/dashboard/blogs-detail/${data.id}`}>
          <p className="font-HelveticaNeueMedium text-darkColor text-base pt-3 line-clamp-1">
            <HighlightedText
              text={data.description}
              searchTerm={highlightSearchTerm}
            />
          </p>
        </Link>
      </div>
      {/* {!hidebutton && ( */}
        <Link
          to={
            isShow
              ? `//dashboard/add-blog?id=${data.id}`
              : `/dashboard/blogs-detail/${data.id}`
          }
          className="h-[10%] flex items-center"
        >
          <button className="bg-gkRedColor py-2 mt-2 text-white rounded-full w-full text-sm font-HelveticaNeueRegular flex justify-center items-center">
            {isShow ? (
              <>
                <Pencil size={15} />
                <span className="pl-2">Edit Blog</span>
              </>
            ) : (
              <span className="pl-2">Show Blog</span>
            )}
          </button>
        </Link>
      {/* )} */}
    </div>
    // <div className="rounded-xl w-full px-4 py-3 mt-3">
    //   <div
    //     className="bg-cover bg-no-repeat p-4 rounded-xl"
    //     style={{
    //       backgroundImage: `url("${data.images.length > 0 ? data.images: "/assets/images/blog-default.png"} ")`,
    //     }}
    //   >
    //     <div className="flex justify-between items-center border-b-2 border-darkColor/20 pb-3">
    //       <div className={`${isShow ? 'w-full' : 'w-[60%]'} flex items-center`}>
    //         {loading && (
    //           <>
    //             <ImageTag
    //               path={
    //                 userData.profilePicture !== ""
    //                   ? userData.profilePicture
    //                   : "/assets/images/default-image.png"
    //               }
    //               classes="size-10 rounded-full object-cover"
    //               altText="logo"
    //             />
    //             <div className="pl-3">
    //               <p className="font-HelveticaNeueMedium text-white text-base">
    //                 {userData.firstname} {userData.lastname}
    //               </p>
    //               <p className="font-HelveticaNeueMedium text-white text-xs">
    //                 {timeAgo(data.createdAt)}
    //               </p>
    //             </div>
    //           </>
    //         )}
    //       </div>
    //       {isShow && (
    //         <div
    //           className="w-[40%] flex justify-end text-darkColor relative"
    //           ref={dropdownRef}
    //         >
    //           <Ellipsis
    //             size={30}
    //             className="text-white cursor-pointer"
    //             onClick={toggleMenu}
    //           />
    //           {isOpen && (
    //             <div className="absolute z-20 right-[-10px] top-[18px] mt-2 w-28 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 font-popinsMedium text-sm px-2">
    //               <ul className="py-2 w-full">
    //                 <Link to={`/dashboard/add-blog?id=${data.id}`}>
    //                   <li className=" text-darkColor pb-1 font-HelveticaNeueMedium cursor-pointer flex items-center hover:bg-gkRedColor hover:text-white rounded-md px-1 py-1">
    //                     <Pencil size={18} />
    //                     <span className="pl-3">Edit</span>
    //                   </li>
    //                 </Link>
    //                 <div className="h-[1px] w-full bg-gray-300 my-[6px]"></div>
    //                 <li
    //                   className="cursor-pointer w-full px-1 py-1 flex items-center text-darkColor hover:bg-gkRedColor hover:text-white font-HelveticaNeueMedium rounded-md"
    //                   onClick={onDelete}
    //                 >
    //                   <Trash2 size={18} />
    //                   <span className="pl-3">Delete</span>
    //                 </li>
    //               </ul>
    //             </div>
    //           )}
    //         </div>
    //       )}
    //     </div>
    //     <Link to={`/dashboard/blogs-detail/${data.id}`}>
    //       <div className="pt-28">
    //         <h1 className="font-HelveticaNeueMedium text-2xl text-white">
    //           <HighlightedText
    //             text={data.description}
    //             searchTerm={highlightSearchTerm}
    //           />
    //         </h1>
    //       </div>
    //     </Link>
    //   </div>
    // </div>
  );
};

export default BlogCard;
