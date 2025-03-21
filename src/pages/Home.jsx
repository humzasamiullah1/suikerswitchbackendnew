import HeaderBar from "../components/reuseable/headerBar";
import UserCounter from "../components/Home/count";
import { useState, useEffect } from "react";
import UsersTable from "../components/Home/userTable";
import Reminder from "../components/Home/reminder";
import PlansCard from "../components/Home/plans";
import {
  getProducts,
  getUser,
  getRecipe,
} from "../components/utils/firebasefunctions";
import MainSearch from "../components/global-searchbar/mainSearch"

function Home() {
  const [CountData, setCountData] = useState([]);
  const [userClient, setUserClient] = useState([]);
  const [isGlobalSearch, setIsGlobalSearch] = useState(false);

  const fetchSupermarketData = async () => {
    const data = await getProducts();
    setCountData((prevData) => [
      ...prevData,
      {
        name: "Total Products",
        value: data.length,
        image: "/assets/images/user.png",
        profilePicture: "",
      },
    ]);
  };

  const fetchUserData = async () => {
    const data = await getUser();
    const filterUser = data.filter(
      (user) => user.usertype.toLowerCase() === "client"
    );
    setUserClient(filterUser);
    setCountData((prevData) => [
      ...prevData,
      {
        name: "Total Users",
        value: filterUser.length,
        image: "/assets/images/user.png",
        profilePicture: filterUser.profilePicture,
      },
    ]);
  };

  const fetchRecipeData = async () => {
    const data = await getRecipe();
    setCountData((prevData) => [
      ...prevData,
      {
        name: "Total Recipes",
        value: data.length,
        image: "/assets/images/user.png",
        profilePicture: "",
      },
    ]);
  };

  useEffect(() => {
    fetchUserData();
    fetchSupermarketData();
    fetchRecipeData();
  }, []);

  const handleSearch = (value) => {
    setIsGlobalSearch(value);
  };

  const handleGlobalSearch = (value) => {
    setIsGlobalSearch(value)
  }

  return (
    <div className="w-[95%] mx-auto lg:h-screen pt-12 lg:pt-0 panelScroll">
      {!isGlobalSearch ? (
        <>
          <div className="pt-5 w-full lg:h-[15%]">
            <HeaderBar
              heading="Hello, John!"
              subHeading="Explore information and activity about your property"
              handleSearch={(value) => {
                handleSearch(value);
              }}
            />
          </div>
          <div className="flex flex-wrap justify-between lg:h-[25%]">
            {CountData.map((item) => (
              <div className="w-full lg:w-[32%] pt-4 lg:pt-0">
                <UserCounter countData={item} />
              </div>
            ))}
          </div>
          <div className="lg:h-[60%] w-full flex lg:flex-row flex-col lg:justify-between">
            <div className=" lg:w-[68%] lg:h-[560px] mt-5 lg:mt-0">
              <UsersTable data={userClient} />
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
        </>
      ) : (
        <MainSearch onEmptyBlur={(value)=> handleGlobalSearch(value)}/>
      )}
    </div>
  );
}

export default Home;
