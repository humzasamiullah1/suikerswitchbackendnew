import React, { useState } from "react";
import { auth } from "../../firebase/firebaseConfig"; // Ensure Firebase is correctly imported
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import LabelTag from "../reuseable/label";
import { EyeOff, Eye } from "lucide-react";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const [isToggled2, setIsToggled2] = useState(false);

  const handleToggle2 = () => {
    setIsToggled2(!isToggled2);
  };

  const [isToggled3, setIsToggled3] = useState(false);

  const handleToggle3 = () => {
    setIsToggled3(!isToggled3);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 🔹 Validate Inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      // setError("All fields are required.");
      toast.error("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      // setError("New passwords do not match.");
      toast.error("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        toast.error("No authenticated user found.");
        // setError("No authenticated user found.");
        return;
      }

      // 🔹 Reauthenticate User
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // 🔹 Update Password
      await updatePassword(user, newPassword);
      // setSuccess("Password updated successfully!");
      toast.success("Password updated successfully!");
      setLoading(false);
    } catch (error) {
      // setError(error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="h-full p-5 overflow-scroll panelScroll">
      <h2 className="text-xl font-semibold mb-3">Change Password</h2>

      {/* Error / Success Message */}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleChangePassword}>
        {/* Current Password */}
        {/* <div className="mb-3">
          <label className="block text-sm font-medium">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div> */}
        <div className="w-full mt-3">
          <LabelTag name="Current Password" classes="!text-xs" />
          <div className="relative">
            <input
              type={isToggled ? "text" : "password"}
              placeholder="Password here.."
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full mt-1 text-sm bg-bgColor font-popinsRegular px-3 py-2 rounded-full text-darkColor placeholder:text-zinc-700/50"
            />
            <div
              title="Show password"
              className="absolute right-3 top-3 text-stone-950/40 cursor-pointer"
              onClick={handleToggle}
            >
              {isToggled ? <Eye size={18} /> : <EyeOff size={18} />}
            </div>
          </div>
        </div>

        {/* New Password */}
        {/* <div className="mb-3">
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div> */}
        <div className="w-full mt-1">
          <LabelTag name="New Password" classes="!text-xs" />
          <div className="relative">
            <input
              type={isToggled2 ? "text" : "password"}
              placeholder="Password here.."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-1 text-sm bg-bgColor font-popinsRegular px-3 py-2 rounded-full text-darkColor placeholder:text-zinc-700/50"
            />
            <div
              title="Show password"
              className="absolute right-3 top-3 text-stone-950/40 cursor-pointer"
              onClick={handleToggle2}
            >
              {isToggled2 ? <Eye size={18} /> : <EyeOff size={18} />}
            </div>
          </div>
        </div>

        {/* Confirm New Password */}
        {/* <div className="mb-3">
          <label className="block text-sm font-medium">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div> */}

        <div className="w-full mt-1">
          <LabelTag name="Confirm New Password" classes="!text-xs" />
          <div className="relative">
            <input
              type={isToggled3 ? "text" : "password"}
              placeholder="Password here.."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 text-sm bg-bgColor font-popinsRegular px-3 py-2 rounded-full text-darkColor placeholder:text-zinc-700/50"
            />
            <div
              title="Show password"
              className="absolute right-3 top-3 text-stone-950/40 cursor-pointer"
              onClick={handleToggle3}
            >
              {isToggled3 ? <Eye size={18} /> : <EyeOff size={18} />}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-4 py-2 rounded-full font-HelveticaNeueMedium flex justify-center items-center bg-gkRedColor text-white hover:bg-gkRedColor/90"
        >
          <span>Update Password</span>
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
      <div className="border-2 border-gray-100 rounded-xl px-3 mt-5">
        <div className="pt-3">
          <h1 className="font-HelveticaNeueMedium text-darkColor pb-2 text-base border-b-2 border-gray-100">
            Notifications
          </h1>
          <div className="flex items-center w-full justify-between pt-3">
            <div>
              <p className="font-HelveticaNeueMedium text-sm text-darkColor">
                Notification 1
              </p>
              <p className="font-HelveticaNeueRegular text-darkColor text-xs">
                Lorem ipsum dior dolar{" "}
              </p>
            </div>
            <button
              onClick={handleToggle}
              className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition ${
                isToggled ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-3 h-3 bg-white rounded-full shadow-md transform transition ${
                  isToggled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center w-full justify-between pt-3">
            <div>
              <p className="font-HelveticaNeueMedium text-sm text-darkColor">
                Notification 1
              </p>
              <p className="font-HelveticaNeueRegular text-darkColor text-xs">
                Lorem ipsum dior dolar{" "}
              </p>
            </div>
            <button
              onClick={handleToggle2}
              className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition ${
                isToggled2 ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-3 h-3 bg-white rounded-full shadow-md transform transition ${
                  isToggled2 ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center w-full justify-between py-3">
            <div>
              <p className="font-HelveticaNeueMedium text-sm text-darkColor">
                Notification 1
              </p>
              <p className="font-HelveticaNeueRegular text-darkColor text-xs">
                Lorem ipsum dior dolar{" "}
              </p>
            </div>
            <button
              onClick={handleToggle3}
              className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition ${
                isToggled3 ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-3 h-3 bg-white rounded-full shadow-md transform transition ${
                  isToggled3 ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
