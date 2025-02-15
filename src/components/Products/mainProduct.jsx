import React, { useState } from "react";
import { Search, Menu, CircleArrowDown, Plus } from "lucide-react";
import ProductCard from "./productCard"

const MainProucts = () => {
  const [search, setSearch] = useState("");
  const [cardData, setCardData] = useState(
    [
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },
        {
            mart: 'Daraz Mart',
            title: 'Mango Jam 1KG Bucket By Ashifa Foods',
            price: 'Rs. 749'
        },

    ]
  )

  return (
    <div className="bg-white rounded-[30px] shadow-md px-5 h-full">
      <div className="flex lg:flex-row flex-col justify-between items-center pt-5 lg:h-[12%]">
        <div className="flex justify-between w-full items-center lg:w-[30%] xl:w-[50%]">
          <p className="font-HelveticaNeueMedium text-darkColor/50 text-lg">
            All Products
          </p>
          <div className="bg-gkRedColor md:hidden size-10 rounded-full text-white flex justify-center items-center">
          <Plus size={20}/>
          </div>
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
            <button className="border rounded-full px-4 py-2 flex items-center font-HelveticaNeueRegular text-darkColor bg-gray-200 hover:bg-gray-200">
              <p className="text-sm pr-3">Filters</p>
              <Menu className="h-4 w-4" />
            </button>
            <button className="border hidden rounded-full px-4 w-full py-2 md:flex items-center font-HelveticaNeueRegular text-white bg-gkRedColor hover:bg-gkRedColor/90">
              <p className="text-sm pr-3">Add New Blog</p>
              <CircleArrowDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap lg:h-[88%] lg:overflow-y-scroll panelScroll" id='gk-cards'>
      {cardData.map((item) => (
        <div className="w-full md:w-[32%] xl:w-[23%] md:mr-[2%]">
            <ProductCard data={item}/>
        </div>
      ))}
      </div>
    </div>
  );
};

export default MainProucts;
