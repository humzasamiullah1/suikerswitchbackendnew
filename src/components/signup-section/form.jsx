import React, { useState } from "react";
import LabelTag from "../reuseable/label";
import { EyeOff, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { storage, app } from "../../firebase/firebaseConfig";
import { saveuserdata } from "../utils/firebasefunctions";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
const auth = getAuth();

const FormSection = () => {
  const navigate = useNavigate(); 
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [picturedata, setpicturedata] = useState(
    "../.././../public/assets/images/user.png"
  );
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmShowPassword(!confirmShowPassword);
  };

  const handlefirstnameChange = (event) => {
    setfirstname(event.target.value);
  };

  const handlelastnameChange = (event) => {
    setlastname(event.target.value);
  };
  const handleemailChange = (event) => {
    setemail(event.target.value);
  };

  const handlepasswordChange = (event) => {
    setpassword(event.target.value);
  };
  const handleconfirmpasswordChange = (event) => {
    setconfirmpassword(event.target.value);
  };

  const signuphandler = async (e) => {
    e.preventDefault(); // 👈 Prevent form default behavior
    if (firstname === "") {
      toast.warn("Please enter your first name");
      return;
    } else if (lastname === "") {
      toast.warn("Please enter your last name");
      return;
    } else if (email === "") {
      toast.warn("Please enter your email address");
      return;
    } else if (password === "") {
      toast.warn("Please enter your password");
      return;
    } else if (confirmpassword === "") {
      toast.warn("Please enter your password");
      return;
    } else if (password !== confirmpassword) {
      toast.warn("Passwords do not match");
      return;
    } else {
      try {
        setLoading(true);
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        const imageFile = picturedata;
        if (imageFile) {
          const storageRef = ref(
            storage,
            `profilepicture/${Date.now()}-${imageFile.name}`
          );
          const uploadTask = uploadBytesResumable(storageRef, imageFile);

          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
              toast.error("Upload error: " + error.message);
              setLoading(false);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                const data = {
                  id: user?.uid,
                  firstname: firstname,
                  lastname: lastname,
                  email: email,
                  profilePicture: downloadURL,
                  usertype: 'Admin'
                };
                const response = await saveuserdata(data, user?.uid);
                if (response === "success") {
                  toast.success("Sign Up Successful!"); // ✅ Should Work
                  setLoading(false);
                  setTimeout(() => {
                    navigate("/");
                }, 1000); // 2 second delay
                } else {
                  toast.error(response);
                  setLoading(false);
                }
              } catch (error) {
                toast.error(error.message);
                setLoading(false);
              }
            }
          );
        } else {
          toast.warn("Please upload an image.");
          setLoading(false);
        }
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={signuphandler}>
      <div class="w-full mt-3">
        <LabelTag name="Email" />
        <input
          type="text"
          value={email}
          onChange={handleemailChange}
          placeholder="Enter your email.."
          className="w-full font-popinsRegular mt-1 bg-bgColor px-3 py-2 text-sm rounded-full text-darkColor placeholder:text-zinc-700/50"
        />
      </div>
      <div className="flex flex-col lg:flex-row justify-between mt-4">
        <div className="w-full lg:w-[49%]">
          <LabelTag name="First name" />
          <input
            type="text"
            onChange={handlefirstnameChange}
            value={firstname}
            placeholder="Enter your first name here.."
            className="w-full mt-1 bg-bgColor  px-3 py-2 text-sm rounded-full text-darkColor placeholder:text-zinc-700/50 font-popinsRegular"
          />
        </div>
        <div className="w-full lg:w-[49%] mt-4 lg:mt-0">
          <LabelTag name="Last name" />
          <input
            type="text"
            value={lastname}
            onChange={handlelastnameChange}
            placeholder="Enter your last name here.."
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
              onChange={handlepasswordChange}
              placeholder="Create password here.."
              className="w-full mt-1 bg-bgColor px-3 py-2 text-sm rounded-full text-darkColor placeholder:text-zinc-700/50 font-popinsRegular"
            />
            <div
              title="Show password"
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
              value={confirmpassword}
              onChange={handleconfirmpasswordChange}
              placeholder="Confirm password here.."
              className="w-full mt-1 bg-bgColor px-3 py-2 text-sm rounded-full text-darkColor placeholder:text-zinc-700/50 font-popinsRegular"
            />
            <div
              title="Show password"
              className="absolute right-3 top-3 text-stone-950/40 cursor-pointer"
              onClick={toggleConfirmPasswordVisibility}
            >
              {confirmShowPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* <ButtonTag
          name="Create Account"
          classes="text-base bg-btnColor hover:bg-btnColor/90 mt-5 text-center text-white"
          onClick={() => signuphandler()}
        /> */}
        <button
          className="text-base cursor-pointer font-popinsMedium rounded-full flex justify-center mx-auto py-2 w-full items-center bg-btnColor hover:bg-btnColor/90 mt-5 text-center text-white"
          
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
      </div>
      <div className="font-HelveticaNeueRegular text-darkColor/60 text-sm text-center pt-2">
        <p>
          Don&apos;t have an account ?{" "}
          <Link to={"/"} className="font-HelveticaNeueMedium text-darkColor  ">
            Login
          </Link>
        </p>
      </div>
    </form>
  );
};

export default FormSection;
