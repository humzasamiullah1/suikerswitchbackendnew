"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Menu, Search, Send, Paperclip } from "lucide-react";
import ImageTag from "../reuseable/imageTag";

function ChatApp() {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
      // Yahan ap file ko upload ya process kar skte hain
    }
  };
  const [chats, setChats] = useState({
    1: [
      {
        id: 1,
        text: "Hi there! How are you?",
        sender: "John",
        time: "10:00 AM",
      },
      {
        id: 2,
        text: "I'm good, thanks! How about you?",
        sender: "me",
        time: "10:01 AM",
      },
    ],
    2: [
      {
        id: 1,
        text: "Hey Jane, are we still on for tomorrow?",
        sender: "me",
        time: "9:30 AM",
      },
      { id: 2, text: "Yes, see you then!", sender: "Jane", time: "9:45 AM" },
    ],
    3: [
      {
        id: 1,
        text: "Thanks for your help yesterday, Mike.",
        sender: "me",
        time: "8:00 AM",
      },
      { id: 2, text: "No problem at all!", sender: "Mike", time: "9:30 AM" },
    ],
  });

  const contacts = [
    {
      id: 1,
      name: "John Doe",
      lastMessage: "Hi there! How are you?",
      time: "10:00 AM",
    },
    {
      id: 2,
      name: "Jane Smith",
      lastMessage: "See you tomorrow!",
      time: "9:45 AM",
    },
    {
      id: 3,
      name: "Mike Johnson",
      lastMessage: "Thanks for your help",
      time: "9:30 AM",
    },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && activeChat) {
      const newMessage = {
        id: chats[activeChat].length + 1,
        text: message,
        sender: "me",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChats((prevChats) => ({
        ...prevChats,
        [activeChat]: [...prevChats[activeChat], newMessage],
      }));
      setMessage("");
    }
  };

  const handleChatChange = (contactId) => {
    setActiveChat(contactId);
  };

  return (
    <motion.div
      className="bg-white rounded-[30px] shadow-md px-5 h-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex lg:flex-row flex-col justify-between items-center pt-5 lg:h-[12%]">
        <div className="flex justify-between w-full items-center lg:w-[30%] xl:w-[50%]">
          <p className="font-HelveticaNeueMedium text-darkColor/50 text-lg">
            Chats
          </p>
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
      <div className="flex lg:flex-row flex-col justify-between h-[88%] pt-2">
        {/* Sidebar */}
        <div className="w-full lg:w-[29%] mt-3 lg:mt-0 lg:mb-2 bg-white rounded-xl p-2 border-2 border-gray-100 flex flex-row lg:flex-col overflow-x-auto">
          <div className="flex-1 overflow-y-auto flex flex-row lg:flex-col space-x-2 lg:space-x-0">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex min-w-[250px] items-center p-4 hover:bg-gray-50 rounded-xl cursor-pointer ${
                  activeChat === contact.id ? "bg-gray-100" : ""
                }`}
                onClick={() => handleChatChange(contact.id)}
              >
                <div className="flex items-center justify-center mr-3">
                  <ImageTag
                    path="/assets/images/userprofile.png"
                    classes="size-10 rounded-full object-cover"
                    altText="logo"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-HelveticaNeueMedium text-darkColor text-sm">
                    {contact.name}
                  </h3>
                  <p className="text-xs text-darkColor/50 font-HelveticaNeueRegular">
                    {contact.lastMessage}
                  </p>
                </div>
                <span className="text-xs text-darkColor/50 font-HelveticaNeueRegular">
                  {contact.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col w-full lg:mb-2 lg:w-[69%] rounded-xl my-3 lg:my-0 lg:p-2 border-2  border-gray-100">
          {activeChat ? (
            <>
              <div className="bg-white border-b border-gray-200 p-2 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="flex items-center justify-center mr-3">
                    <ImageTag
                      path="/assets/images/userprofile.png"
                      classes="size-10 lg:size-12 rounded-full object-cover"
                      altText="logo"
                    />
                  </div>
                  <div>
                    <h2 className="font-HelveticaNeueMedium text-base lg:text-lg text-darkColor">
                      {contacts.find((c) => c.id === activeChat).name}
                    </h2>
                    <p className="text-darkColor/50 font-HelveticaNeueMedium text-xs lg:text-sm">
                      1m ago
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chats[activeChat].map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      msg.sender === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-lg p-3 ${
                        msg.sender === "me" ? "text-white" : "bg-white"
                      }`}
                    >
                      <div className={`flex items-center ${msg.sender === "me" ? 'flex-row-reverse' : ''}`}>
                        <p className="text-[13px] text-darkColor font-HelveticaNeueMedium">
                          John Doe
                        </p>
                        <span className={`text-xs text-darkColor/50 font-HelveticaNeueRegular ${msg.sender === "me" ? 'pr-6' : 'pl-6'}`}>
                          {msg.time}
                        </span>
                      </div>
                      <div className="bg-gray-100 mt-1 rounded-lg text-darkColor font-HelveticaNeueRegular text-sm p-2">
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="bg-white border-t border-gray-200 px-1 py-3 flex items-center"
              >
                <div className="w-[70%] lg:w-[80%]">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full mt-1 text-sm font-popinsRegular rounded-full bg-bgColor px-3 py-2 lg:py-3 text-darkColor placeholder:text-zinc-700/50"
                  />
                </div>
                <div className="w-[30%] lg:w-[20%] flex justify-end items-center">
                  <div className="flex items-center mr-1 lg:mr-3">
                    <button
                      onClick={handleIconClick}
                      className="border-2 border-gray-200 size-9 lg:size-12 flex justify-center items-center rounded-full transition"
                      aria-label="Upload File"
                    >
                      <Paperclip className="size-4" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <button
                    type="submit"
                    className="border-2 border-gray-200 size-9 lg:size-12 flex justify-center items-center rounded-full"
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ChatApp;
