import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import EmptyChat from "../components/EmptyChat";
import { useLocation } from "react-router-dom";
const HomePage = () => {
  const location = useLocation();
  const { user, user_id } = location.state || {};

  const [SelectedUser, setSelectedUser] = useState(false);
  const [SelectedUserDetails, setSelectedUserDetails] = useState(null);
  const currentUser = user;
  return (
    <div className=" border w-full h-screen sm:px-[15%] sm:py-[5%] overflow-auto">
      <div className="backdrop-blur-xl   rounded-2xl h-full min-h-0 grid gap-2 grid-cols-4 relative overflow-hidden">
        <Sidebar
          SelectedUser={SelectedUser}
          setSelectdUser={setSelectedUser}
          setSelectedUserDetails={setSelectedUserDetails}
        />
        {!SelectedUser && (
          <>
            <div className="col-span-3 flex justify-center items-center h-full w-full overflow-y-auto">
              <EmptyChat currentUser={currentUser} />
            </div>
          </>
        )}
        {SelectedUser && (
          <>
            <div className="h-full col-span-2 min-h-0 flex flex-col">
              <ChatContainer
                SelectedUser={SelectedUser}
                setSelectdUser={setSelectedUser}
                currentUser={currentUser}
                SelectedUserDetails={SelectedUserDetails}
              />
            </div>
            <div className="h-full min-h-0 flex flex-col overflow-y-auto">
              <RightSidebar
                SelectedUser={SelectedUser}
                setSelectdUser={setSelectedUser}
                SelectedUserDetails={SelectedUserDetails}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
