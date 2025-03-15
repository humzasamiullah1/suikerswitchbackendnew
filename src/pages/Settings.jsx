import HeaderBar from "../components/reuseable/headerBar";
import MainSettings from "../components/account-setting/mainSetting"

function Settings() {
  return (
    <div className="w-[95%] mx-auto lg:h-screen pt-12 lg:pt-0">
      <div className="pt-5 w-full lg:h-[15%]">
        <HeaderBar
          heading="Hello, John!"
          subHeading="Explore information and activity about your property"
        />
      </div>
      <div className="h-[85%] pt-5 lg:pt-0 lg:pb-2 overflow-scroll panelScroll">
        <MainSettings/>
      </div>
    </div>
  );
}

export default Settings;
