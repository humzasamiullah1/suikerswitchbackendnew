import HeaderBar from "../components/reuseable/headerBar";
import UserCounter from "../components/Home/count";
import { useState } from "react";
import UsersTable from "../components/Home/userTable";
import Reminder from "../components/Home/reminder";
import PlansCard from "../components/Home/plans";

function Home() {
  const [count, setCount] = useState([
    {
      name: "Total Users",
      value: 9500,
      lastTotal: "Last month total 1.050",
      image: "/assets/images/user.png",
    },
    {
      name: "Total Products",
      value: 2000,
      lastTotal: "Last month total 1.050",
      image: "/assets/images/pencil.png",
    },
    {
      name: "Total Recipes",
      value: 3500,
      lastTotal: "Last month total 1.050",
      image: "/assets/images/recipt.png",
    },
  ]);
  return (
    <div className="w-[95%] mx-auto lg:h-screen pt-12 lg:pt-0">
      <div className="pt-5 w-full lg:h-[15%]">
        <HeaderBar
          heading="Hello, John!"
          subHeading="Explore information and activity about your property"
        />
      </div>
      <div className="flex flex-wrap justify-between lg:h-[25%]">
        {count.map((item) => (
          <div className="w-full lg:w-[32%] pt-4 lg:pt-0">
            <UserCounter countData={item} />
          </div>
        ))}
      </div>
      <div className="lg:h-[60%] w-full flex lg:flex-row flex-col lg:justify-between">
        <div className=" lg:w-[68%] lg:h-[560px] mt-5 lg:mt-0">
          <UsersTable />
        </div>
        <div className="lg:w-[30%]">
          <div className="mt-5 lg:mt-0">
            <PlansCard />
          </div>
          <div className="mt-5 mb-5 lg:mb-0">
            <Reminder />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
