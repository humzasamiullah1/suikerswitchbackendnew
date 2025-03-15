import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import LabelTag from "../reuseable/label";
import { fetchUserById, uploadUserImage, updateUserProfile } from "../utils/firebasefunctions";
import { useStateValue } from "../../context/StateProvider";
import { toast } from "react-toastify";

const EditProfile = () => {
  const [{ user }] = useStateValue();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    dob: "",
    phoneNumber: "",
    email: "",
    profilePicture: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      const data = await fetchUserById(user.id);
      if (data) {
        setUserData({
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          dob: data.dob || "",
          phoneNumber: data.phoneNumber || "",
          email: data.email || "",
          profilePicture: data.profilePicture || "",
        });
        setImagePreview(data.profilePicture || "");
      }
    };
    fetchUserData();
  }, [user?.id]);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    let imageUrl = userData.profilePicture;
    if (selectedImage) {
      imageUrl = await uploadUserImage(selectedImage, user.id);
    }

    const updatedData = {
      ...userData,
      profilePicture: imageUrl,
    };

    const success = await updateUserProfile(user.id, updatedData);
    if (success) {
      // alert("Profile updated successfully!");
      toast.success("Profile updated successfully!");
      setLoading(false)
    } else {
      // alert("Failed to update profile.");
      toast.success("Failed to update profile.");
      setLoading(false)
    }
  };

  return (
    <div className="border-2 border-gray-100 rounded-xl px-3 h-full">
      <div className="pt-3">
        <h1 className="font-HelveticaNeueMedium text-darkColor pb-2 text-base border-b-2 border-gray-100">
          Edit Profile
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="w-full pb-3 h-[90%] overflow-scroll panelScroll">
        <div className="px-2 pt-2">
          <h2 className="text-sm font-HelveticaNeueMedium pb-2">Profile Picture*</h2>
          <div className="flex space-x-2 relative">
            {imagePreview ? (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="w-20 h-20 flex items-center justify-center bg-red-100 text-red-500 rounded-lg cursor-pointer">
                <Plus size={24} />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>

        <div className="w-full mt-3 px-2">
          <LabelTag name="First Name" classes="!text-xs" />
          <input
            type="text"
            name="firstname"
            value={userData.firstname}
            onChange={handleInputChange}
            placeholder="Write here..."
            className="w-full mt-1 text-sm font-popinsRegular rounded-full bg-bgColor px-3 py-2 text-darkColor"
          />
        </div>

        <div className="w-full pt-1 px-2">
          <LabelTag name="Last Name" classes="!text-xs" />
          <input
            type="text"
            name="lastname"
            value={userData.lastname}
            onChange={handleInputChange}
            placeholder="Write here..."
            className="w-full mt-1 text-sm font-popinsRegular rounded-full bg-bgColor px-3 py-2 text-darkColor"
          />
        </div>

        <div className="w-full pt-1 px-2">
          <LabelTag name="Date of Birth" classes="!text-xs" />
          <input
            type="date"
            name="dob"
            value={userData.dob}
            onChange={handleInputChange}
            className="w-full mt-1 text-sm font-popinsRegular rounded-full bg-bgColor px-3 py-2 text-darkColor"
          />
        </div>

        <div className="w-full pt-1 px-2">
          <LabelTag name="Phone Number" classes="!text-xs" />
          <input
            type="text"
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Write here..."
            className="w-full mt-1 text-sm font-popinsRegular rounded-full bg-bgColor px-3 py-2 text-darkColor"
          />
        </div>

        <div className="w-full pt-1 px-2">
          <LabelTag name="Email" classes="!text-xs" />
          <input
            type="text"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            placeholder="Write here..."
            className="w-full mt-1 text-sm font-popinsRegular rounded-full bg-bgColor px-3 py-2 text-darkColor"
            readOnly
          />
        </div>

        {/* <button type="submit" className="mt-4 w-full bg-blue-500 text-white rounded-full py-2">
          Save Changes
        </button> */}
        <button
            type="submit"
            className="w-full mt-4 py-2 rounded-full font-HelveticaNeueMedium flex justify-center items-center bg-gkRedColor text-white hover:bg-gkRedColor/90"
            disabled={loading}
          >
            <span>Save Changes</span>
            {loading && (
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
      </form>
    </div>
  );
};

export default EditProfile;