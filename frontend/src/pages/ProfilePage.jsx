import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser, setcurrentUser } = useContext(UserContext);

  const { RequestList, friendList } = location.state || {};
  const [showImageModal, setShowImageModal] = useState(false);

  // State for editing
  const [name, setName] = useState(currentUser.fullname);
  const [previewImage, setPreviewImage] = useState(currentUser.profilepic);
  const [Newfile, setNewfile] = useState(null);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setNewfile(file);
    setPreviewImage(URL.createObjectURL(file)); // temp preview
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("fullname", name);
    formData.append("_id", currentUser._id);
    if (Newfile) formData.append("profilepic", Newfile);

    try {
      const response = await axios.post(
        `${API_URL}/user/updateProfile`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setcurrentUser(response.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%] overflow-auto flex justify-center items-center">
      <div className="p-5 h-full w-full rounded-xl flex flex-col backdrop-blur-lg bg-white/10 border border-white/20">
        {/* HOME BUTTON */}
        <button
          className="px-4 py-2 mb-4 rounded-lg text-white font-medium 
                     bg-white/10 backdrop-blur-md border border-white/30 
                     shadow-lg shadow-black/30 hover:bg-white/20 
                     active:scale-95 transition-all duration-200 w-30"
          onClick={() => navigate("/Home")}
        >
          ← HOME
        </button>

        {/* TOP SECTION */}
        <div className="h-1/2 flex flex-col justify-center items-center gap-4">
          {/* Profile Image */}
          <img
            src={previewImage}
            className="w-40 h-40 rounded-full object-cover border cursor-pointer"
            onClick={() => setShowImageModal(true)}
          />

          {/* Hidden File Input */}
          <input
            type="file"
            className="hidden"
            id="upload-photo"
            onChange={handleProfilePicChange}
          />

          {/* Upload Button */}
          <button
            onClick={() => document.getElementById("upload-photo").click()}
            className="px-3 cursor-pointer py-1 text-xs rounded-md bg-white/20 text-white border border-white/30 hover:bg-white/30"
          >
            Upload
          </button>

          {/* Name Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-transparent border-b border-white/40 text-white text-lg outline-none text-center"
            />

            <button
              onClick={handleSave}
              className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="flex-1 flex gap-3 mt-3 min-h-0">
          {/* Request List */}
          <div
            className="w-1/2 border border-white/20 rounded-xl p-3 
                          overflow-y-auto min-h-0 text-white hide-scrollbar"
          >
            <p className="font-semibold mb-2">Request List</p>

            {RequestList?.length > 0 ? (
              RequestList.map((req) => (
                <div key={req._id} className="p-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <img
                      src={req.profilepic}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span>{req.fullname}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm opacity-70">No requests</p>
            )}
          </div>

          {/* Friend List */}
          <div
            className="w-1/2 border border-white/20 rounded-xl p-3 
                          overflow-y-auto min-h-0 text-white .hide-scrollbar"
          >
            <p className="font-semibold mb-2">Friend List</p>

            {friendList?.length > 0 ? (
              friendList.map((friend) => (
                <div key={friend._id} className="p-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <img
                      src={friend.profilepic}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span>{friend.fullname}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm opacity-70">No friends</p>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-5 right-5 text-white text-3xl font-bold cursor-pointer"
          >
            ×
          </button>

          <img
            src={previewImage}
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
