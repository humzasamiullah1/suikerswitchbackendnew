import HeaderBar from '../components/reuseable/headerBar'
import ChatApp from '../components/chat/mainChat'

function Chat() {


  return (
    <div className="w-[95%] mx-auto lg:h-screen pt-12 lg:pt-0">
      <div className="pt-5 w-full lg:h-[15%]">
        <HeaderBar
          heading="Hello, John!"
          subHeading="Explore information and activity about your property"
        />
      </div>
      <div className="h-[85%] pt-5 lg:pt-0 pb-4">
        <ChatApp/>
      </div>
    </div>
  );
}

export default Chat;
