import React, { useState } from "react";
import LabelTag from "../reuseable/label";
import { EyeOff, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { saveuserdata } from "../utils/firebasefunctions";
import { toast, ToastContainer } from "react-toastify";
import { useStateValue } from "../../context/StateProvider";
// import { createUserWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";

const auth = getAuth();

const FormSection = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [{}, dispatch] = useStateValue();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmShowPassword(!confirmShowPassword);
  };

  // const signupHandler = async (e) => {
  //   e.preventDefault();
  //   if (!firstName.trim()) {
  //     toast.warn("Please enter your first name");
  //     return;
  //   }
  //   if (!lastName.trim()) {
  //     toast.warn("Please enter your last name");
  //     return;
  //   }
  //   if (!email.trim()) {
  //     toast.warn("Please enter your email address");
  //     return;
  //   }
  //   if (!password.trim()) {
  //     toast.warn("Please enter your password");
  //     return;
  //   }
  //   if (!confirmPassword.trim()) {
  //     toast.warn("Please confirm your password");
  //     return;
  //   }
  //   if (password !== confirmPassword) {
  //     toast.warn("Passwords do not match");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const userCredential = await createUserWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );
  //     const user = userCredential.user;

  //     const data = {
  //       id: user?.uid,
  //       firstName: firstName,
  //       lastName: lastName,
  //       email: email,
  //       profilePicture: "",
  //       userType: "Admin",
  //       phoneNumber: "",
  //       dob: "",
  //     };

  //     const response = await saveuserdata(data, user?.uid);
  //     if (response === "success") {
  //       toast.success("Sign Up Successful! Please log in.");

  //       // ✅ Auto logout
  //       await signOut(auth);
  //       setLoading(false);
  //       navigate("/"); // ✅ Redirect to login page
  //     } else {
  //       toast.error(response);
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //     setLoading(false);
  //   }
  // };

  const signupHandler = async (e) => {
    e.preventDefault();
    if (firstName === "") {
      toast.warn("Please enter your first name");
      return;
    } else if (lastName === "") {
      toast.warn("Please enter your last name");
      return;
    } else if (email === "") {
      toast.warn("Please enter your email address");
      return;
    } else if (password === "") {
      toast.warn("Please enter your password");
      return;
    } else if (confirmPassword === "") {
      toast.warn("Please enter your password");
      return;
    } else if (password !== confirmPassword) {
      toast.warn("Passwords do not match");
      return;
    } else {
      setLoading(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;

          // Profile picture as empty string
          let data = {
            id: user?.uid,
            firstname: firstName,
            lastname: lastName,
            email: email,
            phonenumber: "",
            profilepicture: "", // Empty string instead of an image
            usertype: "Admin",
            dob: "",
          };

          await saveuserdata(data, user?.uid).then((response) => {
            console.log("User data response: ", response);
            if (response === "success") {
              toast.success("Sign Up Successful");
              setLoading(false);
              dispatch({ type: "SET_NEW_USER", payload: true });
              navigate("/");
            } else {
              toast.error(response);
              setLoading(false);
            }
          });
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
        });
    }
  };

  return (
    <form onSubmit={signupHandler}>
      <div className="w-full mt-3">
        <LabelTag name="Email" />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email.."
          className="w-full font-popinsRegular mt-1 bg-bgColor px-3 py-2 text-sm rounded-full text-darkColor placeholder:text-zinc-700/50"
        />
      </div>
      <div className="flex flex-col lg:flex-row justify-between mt-4">
        <div className="w-full lg:w-[49%]">
          <LabelTag name="First name" />
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name.."
            className="w-full mt-1 bg-bgColor px-3 py-2 text-sm rounded-full text-darkColor placeholder:text-zinc-700/50 font-popinsRegular"
          />
        </div>
        <div className="w-full lg:w-[49%] mt-4 lg:mt-0">
          <LabelTag name="Last name" />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter your last name.."
            className="w-full mt-1 bg-bgColor px-3 py-2 text-sm rounded-full text-darkColor placeholder:text-zinc-700/50 font-popinsRegular"
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-between mt-4">
        <div className="w-full lg:w-[49%]">
          <LabelTag name="Create Password*" />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password.."
              className="w-full mt-1 bg-bgColor px-3 py-2 text-sm rounded-full text-darkColor"
            />
            <div
              className="absolute right-3 top-3 text-stone-950/40 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[49%] mt-4 lg:mt-0">
          <LabelTag name="Confirm Password" />
          <div className="relative">
            <input
              type={confirmShowPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password.."
              className="w-full mt-1 bg-bgColor px-3 py-2 text-sm rounded-full text-darkColor"
            />
            <div
              className="absolute right-3 top-3 text-stone-950/40 cursor-pointer"
              onClick={toggleConfirmPasswordVisibility}
            >
              {confirmShowPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          </div>
        </div>
      </div>
      {/* <button type="submit" className="w-full mt-5 py-2 bg-btnColor text-white rounded-full flex justify-center items-center">
        {loading ? "Processing..." : "Create Account"}
      </button> */}
      <button
        type="submit"
        className="text-base font-HelveticaNeueMedium bg-btnColor hover:bg-btnColor/90 mt-3 flex justify-center items-center text-white rounded-full py-2 w-full"
      >
        <span>Create Account</span>
        {loading && (
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
      <ToastContainer />
    </form>
  );
};

export default FormSection;
