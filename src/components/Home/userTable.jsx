import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Menu } from "lucide-react";
import ImageTag from "../../components/reuseable/imageTag";

const users = [
  {
    id: 1,
    name: "Olivia Martin",
    email: "emma.davis@example.com",
    contact: "+1 (555) 234-5678",
    status: "Cancelled",
  },
  {
    id: 2,
    name: "Olivia Martin",
    email: "emma.davis@example.com",
    contact: "+1 (555) 234-5678",
    status: "Active",
  },
  {
    id: 3,
    name: "Olivia Martin",
    email: "emma.davis@example.com",
    contact: "+1 (555) 234-5678",
    status: "Active",
  },
  {
    id: 4,
    name: "Olivia Martin",
    email: "emma.davis@example.com",
    contact: "+1 (555) 234-5678",
    status: "Renewal",
  },
  {
    id: 5,
    name: "Olivia Martin",
    email: "emma.davis@example.com",
    contact: "+1 (555) 234-5678",
    status: "Active",
  },
  {
    id: 6,
    name: "Olivia Martin",
    email: "emma.davis@example.com",
    contact: "+1 (555) 234-5678",
    status: "Renewal",
  },
];

export default function ResponsiveTable() {
  const [search, setSearch] = useState("");

  return (
    <div className="h-full bg-white rounded-[35px] shadow-md py-5 lg:py-0">
      {/* Header Section */}
      <div className="flex md:flex-row flex-col justify-between items-center h-[15%] w-[95%] mx-auto">
        <h2 className="text-lg lg:text-xl font-HelveticaNeueMedium">Users</h2>
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
          <button className="border rounded-full px-4 py-2 flex items-center font-HelveticaNeueRegular text-darkColor bg-gray-200 hover:bg-gray-200">
            <p className="text-sm pr-3">Filters</p>
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto h-[75%] overflow-y-auto panelScroll w-[98%] mx-auto pt-1">
        <motion.table
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full min-w-[600px] border-collapse"
        >
          <thead>
            <tr className=" shadow-md rounded-full text-sm md:text-base text-left font-HelveticaNeueMedium text-darkColor">
              <th className="p-4 w-12">#</th>
              <th className="p-4 w-1/4">Name</th>
              <th className="p-4 w-1/4">Email</th>
              <th className="p-4 w-1/4">Contact Number</th>
              <th className="p-4 w-1/4">Subscriptions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: user.id * 0.1 }}
                className="hover:bg-gray-50 rounded-full cursor-pointer shadow-md font-HelveticaNeueMedium text-darkColor"
              >
                <td className="p-4">{user.id}</td>
                <td className="p-4">
                  <div className="flex items-center">
                    <ImageTag
                      path="/assets/images/userprofile.png"
                      classes="size-10 rounded-full"
                      altText="logo"
                    />
                    <span className="pl-2">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="p-4 truncate max-w-[150px]">{user.email}</td>
                <td className="p-4">{user.contact}</td>
                <td
                  className={`p-4 font-semibold ${
                    user.status === "Cancelled"
                      ? "text-[#FF3115]"
                      : user.status === "Active"
                      ? "text-[#68DE50]"
                      : "text-[#FFEF5B]"
                  }`}
                >
                  {user.status}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>
      <div className="h-[10%] flex justify-center items-center">
        <p className="font-HelveticaNeueMedium text-darkColor/70 text-base cursor-pointer">View All</p>
      </div>
    </div>
  );
}
