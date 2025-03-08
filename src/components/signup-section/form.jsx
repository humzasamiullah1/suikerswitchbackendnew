import React, { useState } from "react";
import LabelTag from "../reuseable/label";
import { EyeOff, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { saveuserdata } from "../utils/firebasefunctions";
import { toast } from "react-toastify";
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmShowPassword(!confirmShowPassword);
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    if (!firstName.trim()) {
      toast.warn("Please enter your first name");
      return;
    }
    if (!lastName.trim()) {
      toast.warn("Please enter your last name");
      return;
    }
    if (!email.trim()) {
      toast.warn("Please enter your email address");
      return;
    }
    if (!password.trim()) {
      toast.warn("Please enter your password");
      return;
    }
    if (!confirmPassword.trim()) {
      toast.warn("Please confirm your password");
      return;
    }
    if (password !== confirmPassword) {
      toast.warn("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
  
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const data = {
        id: user?.uid,
        firstName: firstName,
        lastName: lastName,
        email: email,
        profilePicture: "",
        userType: "Admin",
        phoneNumber: "",
        dob: "",
      };
  
      const response = await saveuserdata(data, user?.uid);
      if (response === "success") {
        toast.success("Sign Up Successful! Please log in.");
  
        // ✅ Auto logout
        await signOut(auth);
  
        setLoading(false);
        navigate("/"); // ✅ Redirect to login page
      } else {
        toast.error(response);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
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
            <div className="absolute right-3 top-3 text-stone-950/40 cursor-pointer" onClick={togglePasswordVisibility}>
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
            <div className="absolute right-3 top-3 text-stone-950/40 cursor-pointer" onClick={toggleConfirmPasswordVisibility}>
              {confirmShowPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          </div>
        </div>
      </div>
      <button type="submit" className="w-full mt-5 py-2 bg-btnColor text-white rounded-full flex justify-center items-center">
        {loading ? "Processing..." : "Create Account"}
      </button>
    </form>
  );
};

export default FormSection;
