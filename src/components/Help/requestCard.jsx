import React, { useState, useEffect } from "react";
import ImageTag from "../reuseable/imageTag";
import { fetchUserById } from "../utils/firebasefunctions";

const RequestCard = ({ data, onAccept, onReject }) => {
  const [loading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    dob: "",
    phoneNumber: "",
    email: "",
    profilePicture: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!data?.userId) return;

      const userData = await fetchUserById(data.userId);

      if (userData) {
        setUserData({
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          dob: userData.dob || "",
          phoneNumber: userData.phoneNumber || "",
          email: userData.email || "",
          profilePicture: userData.profilePicture || "",
        });
        setIsLoading(true);
      }
    };
    fetchUserData();
  }, [data?.userId]);

  return (
    <div className="bg-gray-100 text-darkColor rounded-2xl px-3 py-3 mt-2">
      <div className="flex items-center">
        {loading && (
          <>
            <ImageTag
              path={
                userData.profilePicture !== ""
                  ? userData.profilePicture
                  : "/assets/images/default-image.png"
              }
              classes="size-10 rounded-full object-cover"
              altText="logo"
            />
            <p className="font-HelveticaNeueMedium text-sm pl-3"> {userData.firstname} {userData.lastname}</p>
          </>
        )}
      </div>
      <p className="font-HelveticaNeueRegular text-sm line-clamp-3 pt-3">
        {data.description}
      </p>
      <div className="flex justify-between pt-4">
        <div className="w-[48%]">
          <button onClick={()=> onAccept(data.id)} className="text-white w-full py-2 font-HelveticaNeueMedium bg-[#62BD4F] text-sm rounded-full">
            Accept
          </button>
        </div>
        <div className="w-[48%]">
          <button onClick={()=> onReject(data.id)} className="text-white w-full py-2 font-HelveticaNeueMedium bg-gkRedColor text-sm rounded-full">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
