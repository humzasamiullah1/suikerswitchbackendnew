import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { EyeOff, Eye } from "lucide-react";
import { useStateValue } from "../../context/StateProvider";
import { actionType } from "../../context/reducer";
import { userlogin, getuserinformation } from "../utils/firebasefunctions";
import { getAuth, signOut } from "firebase/auth";

const FormSection = () => {
  const auth = getAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [laoding, setlaoding] = useState(false);
  const [isCheckEmail, setIsCheckEmail] = useState(false);
  const [isCheckPassword, setIsCheckPassword] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  // const [isAdmin, setIsAdmin] = useState(null); // 👈 Flag for admin check
  const navigate = useNavigate();
  const [{}, dispatch] = useStateValue();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const proceedhandler = async (e) => {
    e.preventDefault();
    if (email === "") {
      toast.warn("Please enter your email");
      setIsCheckEmail(true);
      return;
    }
    if (password === "") {
      toast.warn("Please enter your password");
      setIsCheckPassword(true);
      return;
    }

    setIsCheckEmail(false);
    setIsCheckPassword(false);
    setlaoding(true);

    try {
      const loginResponse = await userlogin(email, password);

      if (loginResponse?.uid) {
        const userInfo = await getuserinformation("users", loginResponse?.uid);
        if (userInfo.usertype === "Admin") {
          dispatch({
            type: actionType.SET_USER,
            payload: userInfo,
          });
          setlaoding(false);
          toast.success("login successfully");
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000); // 2 second delay
        } else {
          setlaoding(false);

          if (userInfo.usertype === "Project") {
            toast.warn(
              "Projects dashboard is under maintenance. Please sign in with your Admin account!"
            );
          } else {
            toast.warn("Employees ");
            await signOut(auth);
          }
        }
      } else {
        toast.error(loginResponse.code || "Login failed");
        setlaoding(false);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
      setlaoding(false);
    }
  };

  return (
    <form className="w-[40%]" onSubmit={proceedhandler}>
      <div className="w-full mt-3">
        <input
          type="text"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          placeholder="Enter your email.."
          className={`w-full mt-1 ${
            isCheckEmail ? "border-2 border-red-600" : ""
          } text-sm rounded-full bg-bgColor px-3 py-2 text-darkColor placeholder:text-zinc-700/50`}
        />
      </div>
      <div className="w-full mt-3">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            placeholder="Password here.."
            className={`w-full ${
              isCheckPassword ? "border-2 border-red-600" : ""
            } mt-1 text-sm bg-bgColor px-3 py-2 rounded-full text-darkColor placeholder:text-zinc-700/50`}
          />
          <div
            title="Show password"
            className="absolute right-3 top-3 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-3 ">
        {/* <div className="flex w-[50%]">
          <input
            type="checkbox"
            className="w-4 bg-bgColor rounded-sm cursor-pointer"
          />
          <p className="font-HelveticaNeueMedium text-darkColor text-xs pl-3">Remember me</p>
        </div> */}
        {/* <Link to={"/forget-password"} className="w-full flex justify-end">
          <p className="text-btnColor">Forget Password</p>
        </Link> */}
      </div>
      <button
        type="submit"
        className="text-base font-HelveticaNeueMedium  bg-gkRedColor hover:bg-gkRedColor/90 mt-3 flex justify-center items-center text-white rounded-full py-2 w-full"
      >
        <span>Log In</span>
        {laoding && (
          <div role="status" className="pl-3">
            <svg
              aria-hidden="true"
              class="w-6 h-6 text-gray-200 animate-spin dark:text-white fill-gkRedColor"
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
      {/* <div className="flex items-center my-2">
        <div className="w-[15%] lg:w-[30%] 2xl:w-[35%] bg-[#1A1A1A]/30 h-[1px]"></div>
        <div className="w-[70%] lg:w-[40%] 2xl:w-[30%] flex justify-center">
          <p className="font-HelveticaNeueRegular text-xs">Do you have account?</p>
        </div>
        <div className="w-[15%] lg:w-[30%] 2xl:w-[35%] bg-[#1A1A1A]/30 h-[1px]"></div>
      </div>
      <Link to={"/signup"}>
        <button
          type="button"
          className="text-base font-HelveticaNeueMedium border border-btnColor hover:bg-btnColor/90 hover:text-white mt-3 flex justify-center items-center text-btnColor rounded-full py-2 w-full"
        >
          Sign Up
        </button>
      </Link> */}
      <ToastContainer />
    </form>
  );
};

export default FormSection;
