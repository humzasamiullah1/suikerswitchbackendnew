import React, { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, Reply, X, Ellipsis, Paperclip, Send } from "lucide-react";
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

const CommentsPopup = ({ data, onClose }) => {
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
    <main className="w-full h-screen backdrop-blur-sm bg-black/80 fixed inset-0 z-50 flex items-center justify-center">
      <section className="w-[90%] sm:w-[65%] md:w-[50%] lg:w-[40%] xl:w-[40%] bg-texture myshades rounded-[31px] mx-auto">
        <div class="bg-white py-8 lg:py-5 rounded-xl justify-center items-center flex flex-col">
          <div className="flex justify-end w-[90%] pb-2 mx-auto border-b-2 border-gray-100">
            <X className="cursor-pointer" onClick={onClose} />
          </div>
          <div className="p-4">
            <div className="overflow-y-scroll max-h-[400px] panelScroll">
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
                  className="flex-1 bg-transparent border-none outline-none py-2"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="flex items-center space-x-2 text-gray-500">
                  <Paperclip size={22}/>
                </div>
              </div>
              <button
                onClick={handleAddComment}
                className="ml-2 border border-gray-200 text-white p-2 rounded-full"
              >
                <Send size={22} className="text-darkColor"/>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CommentsPopup;
