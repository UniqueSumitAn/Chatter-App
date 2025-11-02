import React from "react";
import DummyUser from "../assets/DummyUser";
import axios from "axios";

const RightSidebar = ({ SelectedUser, setSelectdUser }) => {
  const User = DummyUser.find((u) => u.Name === SelectedUser);
  console.log(User);
  const logout = async () => {
    console.log("logout button pressed");
    const response = await axios.post("http://localhost:5000/user/logout", {
      withCredentials: true,
    });
  };

  return (
    <div className=" flex flex-col justify-center items-center h-full min-h-0 backdrop-blur-lg bg-white/10 border border-white/20 rounded-l-xl">
      {/* profile pic */}
      <img src={User.ProfilePic} />
      <p>{User.Name}</p>
      <button
        className="bg-amber-600"
        onClick={() => {
          logout();
        }}
      >
        logout
      </button>
    </div>
  );
};

export default RightSidebar;
