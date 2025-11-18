import React, { useState } from "react";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import DummyUser from "../assets/DummyUser";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const RightSidebar = ({
  SelectedUserDetails,
  isFriend,
  RequestList,
  friendList,
}) => {
  const { currentUser, setcurrentUser } = useContext(UserContext);
  const [showImageModal, setShowImageModal] = useState(false);
  const logout = async () => {
    const response = await axios.post("http://localhost:5000/user/logout", {
      withCredentials: true,
    });
  };
  const navigate = useNavigate();
  return (
    <div className=" flex flex-col justify-center items-center h-full min-h-0 backdrop-blur-lg bg-white/10 border border-white/20 rounded-l-xl">
      <div className="absolute top-3 left-0 right-0 flex justify-between items-center px-3">
        <div
          onClick={() =>
            navigate("/Profile", {
              state: {
                currentUser: currentUser,
                RequestList,
                friendList,
                setcurrentUser,
              },
            })
          }
          className="flex items-center cursor-pointer gap-2"
        >
          <img
            src={currentUser.profilepic}
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="text-white">{currentUser.fullname}</p>
        </div>

        <button
          className="backdrop-blur-lg bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-black cursor-pointer"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {isFriend && (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <img
            src={SelectedUserDetails.profilepic}
            className="w-50 h-50 cursor-pointer object-cover "
            onClick={()=>setShowImageModal(true)}
          />
          <p className="text-white text-lg">{SelectedUserDetails.fullname}</p>
        </div>
      )}

      {showImageModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
          {/* Close Button */}
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-5 right-5 text-white text-3xl font-bold cursor-pointer"
          >
            ×
          </button>

          {/* Image */}
          <img
            src={SelectedUserDetails.profilepic}
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
