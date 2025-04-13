import { useState } from "react";
import HeaderBar from '../components/reuseable/headerBar'
import MainCategory from "../components/category/maniCategory"
import MainSearch from "../components/global-searchbar/mainSearch"

function Category() {
  const [isGlobalSearch, setIsGlobalSearch] = useState(false);

  const handleSearch = (value) => {
    setIsGlobalSearch(value);
  };

  const handleGlobalSearch = (value) => {
    setIsGlobalSearch(value)
  }


  return (
    <div className="w-[95%] mx-auto lg:h-screen pt-12 lg:pt-0">
      {/* {!isGlobalSearch ? ( */}
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
      <div className="h-[85%] pt-5 lg:pt-0">
        <MainCategory />
      </div>
      </>
      {/* ) : (
        <MainSearch onEmptyBlur={(value)=> handleGlobalSearch(value)}/>
      )} */}
    </div>
  );
}

export default Category;
