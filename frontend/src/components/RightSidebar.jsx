import { useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const RightSidebar = ({
  SelectedUserDetails,
  isFriend,
  RequestList,
  friendList,
  messages,
  setMessages,
}) => {
  const navigate = useNavigate();
  const { currentUser, setcurrentUser } = useContext(UserContext);
  const [showImageModal, setShowImageModal] = useState(false);
  const [mediaGallery, setmediaGallery] = useState([]);
  const [ModelSrc, setModelSrc] = useState()
  const logout = async () => {
    console.log("logout route hit");
    const response = await axios.get(`${API_URL}/user/logout`, {
      withCredentials: true,
    });

    if (response.data.success) {
      navigate("/");
    }
  };
  useEffect(() => {
    if (!messages) return;

    const medias = messages.filter(
      (msg) => msg.type === "image" || msg.type === "video"
    );

    setmediaGallery(medias);
  }, [messages]);

  return (
    <div className=" flex flex-col justify-center items-center h-full min-h-0 backdrop-blur-lg bg-white/10 border border-white/20 rounded-l-xl">
      <div className="absolute top-3 left-0 right-0 flex justify-between items-center px-3">
        <div
          onClick={() =>
            navigate("/Profile", {
              state: {
                RequestList,
                friendList,
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
        <>
          <div className="flex flex-col items-center pt-20 pb-4">
            <img
              src={SelectedUserDetails.profilepic}
              className="w-40 h-40 rounded-lg cursor-pointer object-cover"
              onClick={() => {
                setShowImageModal(true);
                setModelSrc(SelectedUserDetails.profilepic);
              }}
            />
            <p className="text-white text-lg mt-3">
              {SelectedUserDetails.fullname}
            </p>
          </div>

          <div className="w-full px-4 mb-3">
            <p className="text-white/80 text-sm mb-2">
              Media shared in this chat
            </p>

            <div className="max-h-60 overflow-y-auto hide-scrollbar grid grid-cols-3 gap-2 pr-1">
              {mediaGallery.length === 0 && (
                <p className="text-white/50 text-xs">No media yet</p>
              )}

              {mediaGallery.map((media, index) => (
                <div
                  key={index}
                  className="w-full h-20 rounded-lg overflow-hidden"
                >
                  {media.type === "image" ? (
                    <img
                      src={media.image_link}
                      className="w-full h-full object-cover rounded-lg cursor-pointer"
                      onClick={() => {
                        setShowImageModal(true);
                        setModelSrc(media.image_link);
                      }}
                    />
                  ) : (
                    <video
                      src={media.image_link}
                      className="w-full h-full object-cover rounded-lg cursor-pointer"
                      muted
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
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
            src={ModelSrc}
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
