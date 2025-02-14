import HeaderBar from "../components/reuseable/headerBar";
import UserCounter from "../components/Home/count";
import { useState } from "react";

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
    <div className="w-[95%] mx-auto">
      <div className="pt-5 w-full">
        <HeaderBar
          heading="Hello, John!"
          subHeading="Explore information and activity about your property"
        />
      </div>
      <div className="flex flex-wrap justify-between mt-5">
        {count.map((item) => (
          <div className="w-full lg:w-[32%] pt-4 lg:pt-0">
            <UserCounter countData={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
