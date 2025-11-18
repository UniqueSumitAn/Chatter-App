import React, { useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import {useContext} from "react";
import chatIcon from "../assets/team.png";
import menu from "../assets/dots.png";
import search from "../assets/people.png";
import { Navigate, useNavigate } from "react-router-dom";
import DummyUser from "../assets/DummyUser";
import axios from "axios";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const Sidebar = ({
  setSelectdUser,
  setSelectedUserDetails,
  setisFriend,
  friendList,
  setFriendList,
  RequestList,
  setRequestList,
  setMessageRequest,
  declineRequest,
  setdeclineRequest,
}) => {
  const { currentUser, setcurrentUser } = useContext(UserContext);
  const [Suggestions, setSuggestions] = useState([]);
  const [SearchfriendText, setSearchFriendText] = useState();
  const handledeclineRequest = async (data) => {
    setdeclineRequest(data);
    const response = await axios.post(
      `${API_URL}:5000/user/declinerequest`,
      data,
      { withCredentials: true }
    );
    if (response.data.success) {
      const friendlist = await axios.get(
        `${API_URL}:5000/user/friendList`,
        {
          withCredentials: true,
        }
      );
      setFriendList(friendlist.data.friends);
      setRequestList(friendlist.data.requests);
    }
  };
  const messageRequest = async (data) => {
    setSelectedUserDetails(data);
    setSelectdUser(data._id);
    setisFriend(true);
    const response = await axios.post(
      `${API_URL}/user/checkFriendList`,
      data,
      { withCredentials: true }
    );
    setMessageRequest(response.data.message);
  };

  const acceptRequest = async (data) => {
    const response = await axios.post(
      `${API_URL}/user/acceptRequest`,
      data,
      {
        withCredentials: true,
      }
    );

    setFriendList((prev) => [...prev, response.data.newFriend]);
    setRequestList(response.data.requests || []);
  };

  const handleSuggestionClick = async (data) => {
    let found = false;
    for (let i = 0; i < friendList.length; i++) {
      if (friendList[i]._id === data._id) {
        found = true;
        break;
      }
    }
    setisFriend(found);
    setSelectdUser(data._id);
    setSelectedUserDetails(data);
  };
  const searchFriend = async (text) => {
    setSearchFriendText(text);
    const response = await axios.get(
       `${API_URL}/user/searchfriend?query=${text}`,
      {
        withCredentials: true,
      }
    );
    setSuggestions(response.data);
  };

  useEffect(() => {
    const fetchFriendList = async () => {
      try {
        const response = await axios.get(
          `${API_URL}:5000/user/friendList`,
          {
            withCredentials: true,
          }
        );

        setFriendList(response.data.friends || []);
        setRequestList(response.data.requests || []);
      } catch (error) {
        console.error("Error fetching friend list:", error);
        setFriendList([]); // fallback if request fails
      }
    };

    fetchFriendList();
  }, []);
  const navigate = useNavigate();
  return (
    <div className="p-5 min-h-0 h-full rounded-r-xl flex flex-col backdrop-blur-lg bg-white/10 border border-white/20">
      {/* logo and profile options */}
      <div className="flex justify-between items-center">
        <img src={chatIcon} alt="chat icon" className="w-8 aspect-square " />

        {/* group is a utility class that lets you apply styles to child elements when the parent is in a specific state — like hover, focus, etc. */}
        <div className=" relative py-2 group">
          <img src={menu} alt=" menu" className="max-h-5 cursor-pointer" />
          <div className=" absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
            <p
              className=" cursor-pointer text-sm"
              onClick={() =>
                navigate("/Profile", {
                  state: {
                    
                    RequestList,
                    friendList,
                  },
                })
              }
            >
              Edit Profile
            </p>
            <hr />
            <p
              className=" cursor-pointer text-sm"
              onClick={() => navigate("/Logout")}
            >
              Logout
            </p>
          </div>
        </div>
      </div>

      {/* search friends */}
      <div className=" rounded-full flex items-center gap-2 mt-5 py-3 px-4 bg-[#282142]">
        <img src={search} alt=" searchIcon" className="w-3 aspect-square" />
        <input
          onChange={(e) => {
            searchFriend(e.target.value);
          }}
          value={SearchfriendText}
          type="text"
          className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
          placeholder="Search Friends"
        />
      </div>

      {/* Show search results */}
      <div className="mt-3 text-white text-sm">
        {Suggestions.length > 0
          ? Suggestions.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-2 p-2 hover:bg-[#3b2a63] cursor-pointer rounded-lg"
                onClick={() => {
                  handleSuggestionClick(user);
                }}
              >
                <img
                  src={user.profilepic || "/defaultAvatar.png"}
                  alt={user.fullname}
                  className="w-6 h-6 rounded-full"
                />
                <span>{user.fullname}</span>
              </div>
            ))
          : SearchfriendText && (
              <p className="text-gray-400 text-xs mt-2">No users found</p>
            )}
      </div>

      {/* friends list */}
      <div className=" overflow-y-auto hide-scrollbar mt-5 flex-1">
        {RequestList.map((requests, index) => (
          <div
            key={index}
            className="flex flex-col justify-between items-center p-2 border-b border-gray-700 text-amber-50 gap-2 cursor-pointer hover:bg-[#3b2a63] rounded-lg"
          >
            <div className="flex items-center gap-1">
              <img
                src={requests.profilepic}
                alt={requests.fullname}
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className=" ml-2">{requests.fullname}</span>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 rounded-lg bg-blue-500/40 backdrop-blur-sm border border-white/20 text-white hover:bg-blue-500/60 transition"
                  onClick={() => messageRequest(requests)}
                >
                  Message
                </button>

                <button
                  className="px-4 py-2 rounded-lg bg-red-700/40 backdrop-blur-sm border border-white/20 text-white hover:bg-red-700/60 transition"
                  onClick={() => handledeclineRequest(requests)}
                >
                  Decline
                </button>
              </div>

              <button
                className="px-4 py-2 rounded-lg bg-green-700/40 backdrop-blur-sm border border-white/20 text-white hover:bg-green-700/60 transition w-full"
                onClick={() => acceptRequest(requests)}
              >
                Accept
              </button>
            </div>
          </div>
        ))}

        {friendList.map((friend, index) => (
          <div
            onClick={() => {
              messageRequest(friend);
            }}
            key={index}
            className="flex justify-between items-center p-2 border-b border-gray-700 text-amber-50 gap-2 cursor-pointer hover:bg-[#3b2a63] rounded-lg"
          >
            <div className="flex items-center gap-1">
              <img
                src={friend.profilepic}
                alt={friend.fullname}
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className=" ml-2 truncate max-w-22">{friend.fullname}</span>
            </div>
            <span
              className={
                friend.status === "online" ? "text-green-300" : "text-gray-300"
              }
            >
              {friend.status === "online" ? " •online" : "•Offline"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
