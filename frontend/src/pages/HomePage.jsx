import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import EmptyChat from "../components/EmptyChat";

const HomePage = () => {
  const [SelectedUser, setSelectedUser] = useState(false);

  return (
    <div className=" border w-full h-screen sm:px-[15%] sm:py-[5%] overflow-auto">
      <div className="backdrop-blur-xl   rounded-2xl h-full min-h-0 grid gap-2 grid-cols-4 relative overflow-hidden">
        <Sidebar SelectedUser={SelectedUser} setSelectdUser={setSelectedUser} />
        {!SelectedUser && (
          <>
            <div className="col-span-3 flex justify-center items-center h-full w-full overflow-y-auto">
              <EmptyChat />
            </div>
          </>
        )}
        {SelectedUser && (
          <>
            <div className="h-full col-span-2 min-h-0 flex flex-col">
              <ChatContainer
                SelectedUser={SelectedUser}
                setSelectdUser={setSelectedUser}
              />
            </div>
            <div className="h-full min-h-0 flex flex-col overflow-y-auto">
              <RightSidebar
                SelectedUser={SelectedUser}
                setSelectdUser={setSelectedUser}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
