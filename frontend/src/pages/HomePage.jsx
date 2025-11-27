import React, { useState } from "react";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import EmptyChat from "../components/EmptyChat";
import { useLocation } from "react-router-dom";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const HomePage = () => {
  const location = useLocation();
  const { user, user_id } = location.state || {};
  const [friendList, setFriendList] = useState([]);
  const [SelectedUser, setSelectedUser] = useState(false);
  const [SelectedUserDetails, setSelectedUserDetails] = useState(null);
  const [isFriend, setisFriend] = useState(null);
  const [RequestList, setRequestList] = useState([]);
  const [MessageRequest, setMessageRequest] = useState(false);
  const [showMobileRightSidebar, setShowMobileRightSidebar] = useState(false)
  const [declineRequest, setdeclineRequest] = useState();
  const [messages, setMessages] = useState([]);
  const { currentUser, setcurrentUser } = useContext(UserContext);
  console.log(currentUser);
  console.log(API_URL);
  return (
    <div className=" border w-full h-screen sm:px-[15%] sm:py-[5%] overflow-hidden">
      <div className="backdrop-blur-xl rounded-2xl h-full min-h-0  relative overflow-hidden">
        <div className="md:hidden h-full w-full">
          {!SelectedUser && (
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
          )}

          {/* Hide Sidebar → show chat container */}
          {SelectedUser && (
            <div className="h-full">
              <ChatContainer
                SelectedUser={SelectedUser}
                SelectedUserDetails={SelectedUserDetails}
                isFriend={isFriend}
                setFriendList={setFriendList}
                setRequestList={setRequestList}
                MessageRequest={MessageRequest}
                setMessageRequest={setMessageRequest}
                messages={messages}
                setMessages={setMessages}
                setSelectdUser={setSelectedUser}
                setSelectedUserDetails={setSelectedUserDetails}
                setShowMobileRightSidebar={setShowMobileRightSidebar}
              />
            </div>
          )}
          {showMobileRightSidebar && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 bg-[linear-gradient(135deg,#2E005C,#A020F0,#FF2EF3)]">
              <RightSidebar
                SelectedUserDetails={SelectedUserDetails}
                isFriend={isFriend}
                RequestList={RequestList}
                friendList={friendList}
                messages={messages}
                setMessages={setMessages}
                setShowMobileRightSidebar={setShowMobileRightSidebar}
              />

             
            </div>
          )}
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden md:grid grid-cols-4 h-full min-h-0 gap-2 overflow-hidden">
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
            <div className="col-span-3 flex justify-center items-center">
              <EmptyChat />
            </div>
          )}

          {SelectedUser && (
            <>
              <div
                className={`${isFriend ? "col-span-2" : "col-span-3"}
                h-full min-h-0 overflow-hidden flex flex-col`}
              >
                <ChatContainer
                  SelectedUser={SelectedUser}
                  SelectedUserDetails={SelectedUserDetails}
                  isFriend={isFriend}
                  setFriendList={setFriendList}
                  setRequestList={setRequestList}
                  MessageRequest={MessageRequest}
                  setMessageRequest={setMessageRequest}
                  messages={messages}
                  setMessages={setMessages}
                  setSelectdUser={setSelectedUser}
                  setSelectedUserDetails={setSelectedUserDetails}
                />
              </div>

              {isFriend && (
                <RightSidebar
                  SelectedUserDetails={SelectedUserDetails}
                  isFriend={isFriend}
                  RequestList={RequestList}
                  friendList={friendList}
                  messages={messages}
                  setMessages={setMessages}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
