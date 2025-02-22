import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Menu, CircleArrowDown, Plus, Ellipsis } from "lucide-react";
import ImageTag from "../reuseable/imageTag";

const MainRecipiesDetail = () => {
  const [search, setSearch] = useState("");
  return (
    <motion.div
      className="bg-white rounded-[30px] shadow-md px-5 h-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header Section */}
      <div className="flex lg:flex-row flex-col justify-between items-center pt-5 lg:h-[12%]">
        <div className="flex justify-between w-full items-center lg:w-[30%] xl:w-[50%]">
          <p className="font-HelveticaNeueMedium text-darkColor/50 text-lg">
            Recipes Detail
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
            <motion.button
              className="border hidden rounded-full px-4 w-full py-2 md:flex items-center font-HelveticaNeueRegular text-white bg-gkRedColor hover:bg-gkRedColor/90"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="text-sm pr-3">Add New Recipes</p>
              <CircleArrowDown className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Blog List Section */}
      <div className="lg:h-[88%] lg:overflow-y-scroll panelScroll">
        <motion.div
          className="w-[95%] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 1 * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="border-2 border-gray-100 rounded-xl mt-2">
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
            <div className="px-2">
              <ImageTag
                path="/assets/images/recipes.png"
                classes="w-full h-60 rounded-2xl mt-6 object-cover"
                altText="logo"
              />
            </div>
            <div className="pt-6 px-2">
              <h1 className="text-darkColor font-HelveticaNeueMedium text-lg">
                Mrs Balbir Singh's | Biryani
              </h1>
              <p className="text-darkColor font-HelveticaNeueRegular text-sm pt-2">
                Mrs Balbir Singh's | Biryani An absolutely irresistible medley
                of fluffy and fragrant Basmati rice, tender marinated chicken
                (or lamb, prawns, fish, or vegetables), aromatic and freshly
                ground spices bursting with flavour... accentuated by
                caramelised onions... and all enhanced by the slightly roasted
                and nutty background note of ghee. This is food-heaven.   We
                have simplified what can otherwise be quite an ambitious affair,
                without sacrificing any of the complexity of its wonderfully
                sumptuous flavours. Once you experience it, we're sure it will
                become a weekly favourite and one of your go-tos for dinner
                parties. Category: Rice Recipe: 243 Prep Time: 30 mins |
                Marination 2hrs | Cooking Time: 1hr Serves 4 - 6 depending on
                whether serving with other sharing dishes.  INGREDIENTS  FOR THE
                MARINATION: 50g Natural or Greek Yoghurt 1½ tsp Salt 500g
                Chicken (or lamb, beef, prawns or vegetables) 15g Ginger Paste
                (or peeled ginger, finely chopped) 22g (12 level measuring
                tsp) Mrs Balbir Singh’s Biryani Blend
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MainRecipiesDetail;
