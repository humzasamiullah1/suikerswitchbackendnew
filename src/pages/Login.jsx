import { useNavigate } from "react-router-dom";
import ImageTag from "../components/reuseable/imageTag";
import FormSection from "../components/login-form/loginForm";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div className="lg:h-screen flex items-center bg-white">
      <div className="flex w-full lg:w-[90%] mx-auto lg:h-[90vh] rounded-xl">
        {/* <div className="w-[50%] h-full hidden lg:block">
          <ImageTag
            path="/assets/images/auth/auth-image.png"
            classes="w-full h-full"
            altText="login"
          />
        </div> */}
        <div className=" w-full h-screen lg:h-full my-auto flex flex-col items-center justify-center bg-white">
          <div className="w-[80%] mx-auto flex flex-col items-center justify-center">
            <ImageTag
              path="/assets/images/round-logo.png"
              classes="w-[80%] h-[140px] object-contain "
              altText="logo"
            />
            <div className="w-full pt-8 h-full flex items-center justify-center">
              {/* <h1 className="text-fontColor font-HelveticaNeueMedium font-bold xl:text-2xl 2xl:text-3xl">
                Log in
              </h1> */}
              {/* <p className="text-fontColor text-xs pt-1 font-HelveticaNeueRegular">Welcome back! , Please put your login credentials below to start using the dashboard.</p> */}
              <FormSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
