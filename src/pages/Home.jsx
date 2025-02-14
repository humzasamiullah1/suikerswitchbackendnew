import HeaderBar from "../components/reuseable/headerBar";

function Home() {
  return (
    <div className="w-[95%] mx-auto">
      <div className="pt-5 w-full">
        <HeaderBar
          heading="Hello, John!"
          subHeading="Explore information and activity about your property"
        />
      </div>
    </div>
  );
}

export default Home;
