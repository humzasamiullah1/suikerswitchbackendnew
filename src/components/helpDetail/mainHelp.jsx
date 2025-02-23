import React, { useState } from "react";
import { motion } from "framer-motion";
import LikePopup from "../popup/like";
import CommentsPopup from "../popup/comments";
import {
  Search,
  Menu,
  CircleArrowDown,
  Plus,
  Ellipsis,
  ThumbsUp,
  MessageCircle,
  Send,
  Paperclip,
  Reply,
} from "lucide-react";
import ImageTag from "../reuseable/imageTag";

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

const MainHelpDetail = () => {
  const [search, setSearch] = useState("");
  const [isLikePopup, setIsLikePopup] = useState(false);
  const [isCommentPopup, setIsCommentPopup] = useState(false);
  const [comments, setComments] = useState(commentsData);
  const [commentText, setCommentText] = useState("");

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
  return (
    <motion.div
      className="bg-white rounded-[30px] shadow-md px-5 h-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header Section */}
      <div className="flex lg:flex-row border-b border-gray-100 flex-col justify-between items-center pt-5 lg:h-[12%]">
        <div className="flex justify-between w-full items-center lg:w-[30%] xl:w-[50%]">
          <p className="font-HelveticaNeueMedium text-darkColor/50 text-lg">
          Help Elkar Detail
          </p>
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
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="border bg-gray-200 font-HelveticaNeueRegular placeholder:text-darkColor text-darkColor rounded-full py-2 pl-5 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-3 top-3 h-4 w-4 text-darkColor" />
            </div>
            <motion.button
              className="border rounded-full px-4 py-2 flex items-center font-HelveticaNeueRegular text-darkColor bg-gray-200 hover:bg-gray-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="text-sm pr-3">Filters</p>
              <Menu className="h-4 w-4" />
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
                <ImageTag
                  path="/assets/images/blog.png"
                  classes="size-10"
                  altText="logo"
                />
                <div className="pl-3">
                  <p className="font-HelveticaNeueMedium text-darkColor text-base">
                    Olivia Martin
                  </p>
                  <p className="font-HelveticaNeueMedium text-darkColor text-xs">
                    1m ago
                  </p>
                </div>
              </div>
              <div className="w-[40%] flex justify-end text-darkColor">
                <Ellipsis size={30} />
              </div>
            </div>
            <div className="font-HelveticaNeueRegular text-darkColor text-sm pt-4 px-2">
              <p>
                How Ketchup Revolutionized How Food Is Grown, Processed and
                Regulated | Smithsonian and typesetting industry. Lorem Ipsum
                has been the industry's standard dummy text ever since the
                1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book.
              </p>
              <p className="pt-3">
                Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book.
              </p>
            </div>
            <div className="px-2">
              <ImageTag
                path="/assets/images/recipes.png"
                classes="w-full h-60 rounded-2xl mt-6 object-cover"
                altText="logo"
              />
            </div>
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
          </div>
        </motion.div>
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
      </div>

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

export default MainHelpDetail;
