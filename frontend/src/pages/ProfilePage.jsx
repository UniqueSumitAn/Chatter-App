import React from "react";
import { useLocation } from "react-router-dom";

const ProfilePage = () => {
  const location = useLocation();
  const { currentUser } = location.state || {};
  console.log(currentUser)
  return (
    <div className=" border w-full h-screen sm:px-[15%] sm:py-[5%] overflow-auto">
      <div className="p-5 min-h-0 h-full rounded-r-xl rounded-l-xl flex flex-col backdrop-blur-lg bg-white/10 border border-white/20">
        <img src={currentUser.profilepic} className="w-10 h-10 rounded-full" />
        <p className="text-white">{currentUser.fullname}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
