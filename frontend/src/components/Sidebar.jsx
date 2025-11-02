import React from "react";
import chatIcon from "../assets/team.png";
import menu from "../assets/dots.png";
import search from "../assets/people.png";
import { Navigate, useNavigate } from "react-router-dom";
import DummyUser from "../assets/DummyUser";


const Sidebar = ({ SelectedUser, setSelectdUser }) => {
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
                onClick={() => navigate("/Profile")}
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
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search Friends"
          />
        </div>

        {/* friends list */}
        <div className=" overflow-y-auto hide-scrollbar mt-5 flex-1">
          {DummyUser.map((user, index) => (
            <div onClick={()=>setSelectdUser(user.Name)}
              key={index}
              className="flex justify-between items-center p-2 border-b border-gray-700 text-amber-50 gap-2 cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <img
                  src={user.ProfilePic}
                  alt={user.Name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className=" ml-2">{user.Name}</span>
              </div>
              <span className={user.Online? "text-green-300" : "text-gray-300"}>{user.Online ? " •Online" : "•Offline"}</span>
            </div>
          ))}
        </div>
      </div>
    
  );
};

export default Sidebar;
