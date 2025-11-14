import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import EmptyChat from "../components/EmptyChat";
import { useLocation } from "react-router-dom";
const HomePage = () => {
  const location = useLocation();
  const { user, user_id } = location.state || {};
  const [friendList, setFriendList] = useState([]);
  const [SelectedUser, setSelectedUser] = useState(false);
  const [SelectedUserDetails, setSelectedUserDetails] = useState(null);
  const [isFriend, setisFriend] = useState(null);
  const currentUser = user;
  return (
    <div className=" border w-full h-screen sm:px-[15%] sm:py-[5%] overflow-auto">
      <div className="backdrop-blur-xl   rounded-2xl h-full min-h-0 grid gap-2 grid-cols-4 relative overflow-hidden">
        <Sidebar
          SelectedUser={SelectedUser}
          setSelectdUser={setSelectedUser}
          setSelectedUserDetails={setSelectedUserDetails}
          setisFriend={setisFriend}
          friendList={friendList}
          setFriendList={setFriendList}
        />
        {!SelectedUser && (
          <>
            <div
              className={`col-span-3 flex justify-center items-center h-full w-full overflow-y-auto`}
            >
              <EmptyChat currentUser={currentUser} />
            </div>
          </>
        )}
        {SelectedUser && (
          <>
            <div
              className={`h-full ${
                isFriend ? "col-span-2" : "col-span-3"
              } min-h-0 flex flex-col`}
            >
              <ChatContainer
                SelectedUser={SelectedUser}
                setSelectdUser={setSelectedUser}
                currentUser={currentUser}
                SelectedUserDetails={SelectedUserDetails}
                isFriend={isFriend}
                setFriendList={setFriendList}
                friendList={friendList}
              />
            </div>
            {isFriend && (
              <div className="h-full min-h-0 flex flex-col overflow-y-auto">
                <RightSidebar
                  SelectedUser={SelectedUser}
                  setSelectdUser={setSelectedUser}
                  SelectedUserDetails={SelectedUserDetails}
                  isFriend={isFriend}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
