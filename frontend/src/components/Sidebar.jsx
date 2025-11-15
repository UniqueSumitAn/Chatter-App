import React, { useEffect, useState } from "react";
import chatIcon from "../assets/team.png";
import menu from "../assets/dots.png";
import search from "../assets/people.png";
import { Navigate, useNavigate } from "react-router-dom";
import DummyUser from "../assets/DummyUser";
import axios from "axios";
const Sidebar = ({
  currentUser,
  setSelectdUser,
  setSelectedUserDetails,
  setisFriend,
  friendList,
  setFriendList,
  RequestList,
  setRequestList,
}) => {
  const [Suggestions, setSuggestions] = useState([]);
  const [SearchfriendText, setSearchFriendText] = useState();
  const acceptRequest = async (data) => {
    const response = await axios.post(
      "http://localhost:5000/user/acceptRequest",
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
      `http://localhost:5000/user/searchfriend?query=${text}`,
      {
        withCredentials: true,
      }
    );
    setSuggestions(response.data);
  };

  useEffect(() => {
    const fetchFriendList = async () => {
      try {
        console.log("effect hit");
        const response = await axios.get(
          "http://localhost:5000/user/friendList",
          {
            withCredentials: true,
          }
        );
        console.log(response);
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
                    currentUser: currentUser,
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
            className="flex justify-between items-center p-2 border-b border-gray-700 text-amber-50 gap-2 cursor-pointer hover:bg-[#3b2a63] rounded-lg"
          >
            <div className="flex items-center gap-1">
              <img
                src={requests.ProfilePic}
                alt={requests.fullname}
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className=" ml-2">{requests.fullname}</span>
            </div>
            <span
              className={requests.Online ? "text-green-300" : "text-gray-300"}
            >
              <button onClick={() => acceptRequest(requests)}>ACCEPT</button>
            </span>
          </div>
        ))}

        {friendList.map((friend, index) => (
          <div
            onClick={() => {
              setSelectdUser(friend._id);
              setSelectedUserDetails(friend);
              setisFriend(true);
            }}
            key={index}
            className="flex justify-between items-center p-2 border-b border-gray-700 text-amber-50 gap-2 cursor-pointer hover:bg-[#3b2a63] rounded-lg"
          >
            <div className="flex items-center gap-1">
              <img
                src={friend.ProfilePic}
                alt={friend.fullname}
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className=" ml-2">{friend.fullname}</span>
            </div>
            <span
              className={friend.Online ? "text-green-300" : "text-gray-300"}
            >
              {friend.Online ? " •Online" : "•Offline"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
