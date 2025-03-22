import React from "react";
import ImageTag from "../components/reuseable/imageTag";
import FormSection from "../components/signup-section/form.jsx"

function Signup() {
  return (
    <div className="lg:h-screen flex items-center py-12 lg:py-0">
      <div className="flex w-[90%] mx-auto lg:h-[90vh] rounded-xl">
        <div className="w-[50%] h-full hidden lg:block">
          <ImageTag
            path="/assets/images/auth/auth-image.png"
            classes="w-full h-full"
            altText="signup"
          />
        </div>
        <div className="w-full lg:w-[50%] bg-[#FFFFFF] flex flex-col items-center justify-center h-full">
          <div className="w-[90%] lg:w-[80%] mx-auto flex flex-col items-center justify-center py-5">
            <ImageTag
              path="/assets/images/logo.png"
              classes="w-[80%] h-16 md:w-[60%] lg:w-[80%] md:h-20"
              altText="logo"
            />
            <div className="w-full pt-16 h-full">
              <h1 className="text-fontColor font-HelveticaNeueMedium font-bold xl:text-2xl 2xl:text-3xl">
                Sign Up
              </h1>
              <p className="text-fontColor text-xs pt-1 font-HelveticaNeueRegular">
                Welcome back! , New here? Create an account now to start using the dashboard!
              </p>
              <FormSection/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
