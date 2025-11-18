import React, { useState } from "react";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
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
  const [RequestList, setRequestList] = useState([]);
  const [MessageRequest, setMessageRequest] = useState(false);
  const [declineRequest, setdeclineRequest] = useState();

  const { currentUser, setcurrentUser } = useContext(UserContext);

  return (
    <div className=" border w-full h-screen sm:px-[15%] sm:py-[5%] overflow-auto">
      <div className="backdrop-blur-xl rounded-2xl h-full min-h-0 grid gap-2 grid-cols-4 relative overflow-hidden">
        <Sidebar
          setSelectdUser={setSelectedUser}
          setSelectedUserDetails={setSelectedUserDetails}
          setisFriend={setisFriend}
          friendList={friendList}
          setFriendList={setFriendList}
          RequestList={RequestList}
          setRequestList={setRequestList}
          setMessageRequest={setMessageRequest}
          declineRequest={declineRequest}
          setdeclineRequest={setdeclineRequest}
        />
        {!SelectedUser && (
          <>
            <div
              className={`col-span-3 flex justify-center items-center h-full w-full overflow-y-auto`}
            >
              <EmptyChat />
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
                SelectedUserDetails={SelectedUserDetails}
                isFriend={isFriend}
                setFriendList={setFriendList}
                setRequestList={setRequestList}
                MessageRequest={MessageRequest}
                setMessageRequest={setMessageRequest}
              />
            </div>
            {isFriend && (
              <div className="h-full min-h-0 flex flex-col overflow-y-auto">
                <RightSidebar
                  SelectedUserDetails={SelectedUserDetails}
                  isFriend={isFriend}
                  RequestList={RequestList}
                  friendList={friendList}
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
