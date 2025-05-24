import { useEffect, useRef, useState } from "react";
import moment from "moment";
import ProductCard from "./Products/productCard";
import NoData from "./reuseable/noData";
import RecipiesCard from "./Recipies/recipiesCard";
import MenuCard from "./week-menu/menuCard";

const BulkConfirmation = (props) => {
  const [employeedata, setemployeedata] = useState();

  const [loading, setloading] = useState(false);
  const [taskloader, settaskloader] = useState(false);
  const [newtask, setnewtask] = useState("");
  const [newtaskimage, setnewtaskimage] = useState("");
  const [newtaskimagedata, setnewtaskimagedata] = useState("");
  const popupref = useRef(null);
  const fileInput = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupref.current && !popupref.current.contains(event.target)) {
        props.activateoutsidecontainerclick();
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupref]);

  return (
    props.visible && (
      <div className="position absolute z-50  top-[0] left-[0] w-full h-full bg-[rgba(211,211,211,0.4)] flex items-center justify-center ">
        <div
          ref={popupref}
          className=" w-[60%]  bg-white border border-gray-300  rounded-xl   flex items-start justify-center h-[90%] max-h-[90%]  p-4 flex-col"
        >
          <div className="flex w-full h-full overflow-y-scroll justify-center ">
            {props.data.length > 0 ? (
              <div className="flex w-full flex-row items-center justify-between flex-wrap  ">
                {props?.data?.map(
                  (item, index) =>
                    // <motion.div
                    //   key={index}
                    //   className="w-[49%] md:w-[32%] xl:w-[23%]"
                    //   variants={{
                    //     hidden: { opacity: 0, y: 20 },
                    //     visible: { opacity: 1, y: 0 },
                    //   }}
                    //   transition={{ duration: 0.5, ease: "easeOut" }}
                    // >
                    props.bulktype == "weeklymenu" ? (
                      <div className=" w-full  self-center">
                        <MenuCard
                          data={item}
                          hideuserdata={true}
                          // onDelete={() => openConfirmPopup(item.id)}
                        />
                      </div>
                    ) : (
                      <div className="mr-[5px] sm:w-full md:w-[48%] lg:w-[32%] self-center">
                        {props.bulktype == "recipee" ? (
                          <RecipiesCard data={item} hideuserdata={true} />
                        ) : (
                          <ProductCard data={item} hidebutton={true} />
                        )}
                      </div>
                    )

                  // </motion.div>
                )}
              </div>
            ) : (
              <div className="flex w-full h-[350px] md:h-[400px] lg:h-full items-center justify-center">
                <NoData />
              </div>
            )}
          </div>
          <div className="w-full flex justify-end pt-[20px]">
            <button
              onClick={props.upload}
              disabled={props.isUploading}
              type="submit"
              className="border text-xs rounded-full px-4 py-2 flex items-center font-HelveticaNeueMedium text-white bg-gkRedColor hover:bg-gkRedColor/90"
            >
              {"Upload"}
              {/* {props.isUploading && props.progress + "%" } */}
              {props.isUploading && (
                <div role="status" className="pl-3">
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5 text-gray-200 animate-spin dark:text-white fill-gkRedColor"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default BulkConfirmation;
