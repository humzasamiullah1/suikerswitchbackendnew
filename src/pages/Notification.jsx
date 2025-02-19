import HeaderBar from "../components/reuseable/headerBar";

function Notification() {
  return (
    <div className="w-[95%] mx-auto lg:h-screen">
      <div className="pt-5 w-full lg:h-[15%]">
        <HeaderBar
          heading="Hello, John!"
          subHeading="Explore information and activity about your property"
        />
      </div>
      <div className="h-[85%]">
        
      </div>
    </div>
  );
}

export default Notification;
