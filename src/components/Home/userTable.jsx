import { motion } from "framer-motion";
import { useState } from "react";
import { Search } from "lucide-react";
import ImageTag from "../../components/reuseable/imageTag";
import NoData from "../reuseable/noData";

import moment from "moment";

export default function ResponsiveTable({ data }) {
  const [search, setSearch] = useState("");
  console.log(data);

  const filteredUser = data.filter(
    (user) =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase())
  );

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
          {filteredUser.length > 0 ? (
            <>
              <thead>
                <tr className=" shadow-md rounded-full text-sm md:text-base text-left font-HelveticaNeueMedium text-darkColor">
                  <th className="p-4 w-[4%]">#</th>
                  <th className="p-4 lg:w-[20%]">Name</th>
                  <th className="p-4 lg:w-[22%]">Email</th>
                  <th className="p-4 lg:w-[7%] text-center">Subscriptions</th>
                  <th className="p-4 lg:w-[7%] text-center">Status</th>
                  <th className="p-4 w-full lg:w-[20%]">Expire Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredUser.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: user.id * 0.1 }}
                    className="group cursor-pointer rounded-full shadow-md font-HelveticaNeueMedium text-darkColor"
                  >
                    <td className="p-4 rounded-l-full group-hover:bg-gray-50">
                      {i + 1}
                    </td>
                    <td className="p-4 group-hover:bg-gray-50">
                      <div className="flex items-center">
                        {/* {data.length > 0 && */}
                        <ImageTag
                          path={
                            user.profilepicture !== ""
                              ? user.profilepicture
                              : "/assets/images/default-image.png"
                          }
                          classes="size-10 rounded-full object-cover"
                          altText="logo"
                        />
                        {/* } */}

                        <span className="pl-2 overflow-hidden">{user.username}</span>
                      </div>
                    </td>
                    <td className="p-4 group-hover:bg-gray-50 truncate max-w-[150px] ">
                      {user.email}
                    </td>
                    <td className={`${user.subscriptiontype === 'Annual' ? 'text-cyan-500' : 'text-[#68DE50]'} p-4 font-semibold group-hover:bg-gray-50 text-center`}>
                      {user.subscriptiontype === undefined
                        ? "--"
                        : user.subscriptiontype}
                    </td>
                    <td className={`${user.subscriptionexpirydate === undefined ? 'text-[#FF6B6B]' : 'text-[#68DE50]'} p-4 font-semibold  group-hover:bg-gray-50 text-center`}>
                      {user.subscriptionexpirydate === undefined ? 'Pending' : 'Paid'}
                    </td>
                    <td className="p-4 whitespace-nowrap rounded-r-full group-hover:bg-gray-50">
                      {moment(user.subscriptionexpirydate).format("DD-MM-YYYY")}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <NoData />
            </div>
          )}
        </motion.table>
      </div>
      {/* <div className="h-[10%] flex justify-center items-center">
        <p className="font-HelveticaNeueMedium text-darkColor/70 text-base cursor-pointer">
          View All
        </p>
      </div> */}
    </div>
  );
}
