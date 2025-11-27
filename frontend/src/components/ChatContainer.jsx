import { useEffect, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const ChatContainer = ({
  SelectedUser,
  setMessageRequest,
  messages,
  setMessages,
  SelectedUserDetails,
  isFriend,
  setFriendList,
  MessageRequest,
  setRequestList,
  setSelectdUser,
  setSelectedUserDetails,
  setShowMobileRightSidebar,
}) => {
  const { currentUser, setcurrentUser } = useContext(UserContext);
  const [isSending, setisSending] = useState(false);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef(null);
  const [preview, setpreview] = useState(null);
  const [previewType, setpreviewType] = useState(null);
  const [SelectedFile, setSelectedFile] = useState();
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!currentUser?._id) return;

    socketRef.current = io(`${API_URL}`, {
      transports: ["polling", "websocket"],
      withCredentials: true,
      auth: { userId: currentUser._id },
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentUser]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!SelectedUser) return;

      try {
        const res = await axios.get(`${API_URL}/user/${SelectedUser}`, {
          withCredentials: true,
        });
        const formatted = res.data.map((msg) => ({
          ...msg,
          time: new Date(msg.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        setMessages(formatted);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    loadMessages();
  }, [SelectedUser]);

  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    const handleReceive = ({ newMessage, time }) => {
      if (
        newMessage.senderId === SelectedUser ||
        newMessage.receiverId === SelectedUser
      ) {
        setMessages((prev) => [...prev, { ...newMessage, time }]);
      }
    };

    const handleSent = (newMessage) => {
      const formatted = {
        ...newMessage,
        time: new Date(newMessage.createdAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, formatted]);
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("messageSent", handleSent);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("messageSent", handleSent);
    };
  }, [SelectedUser]);

  const uploadImage = async (data, fileType) => {
    const formData = new FormData();
    formData.append("file", data);

    if (fileType == "image") {
      const res = await axios.post(`${API_URL}/user/sendfile`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) return res.data.url;
    }
    if (fileType == "video") {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dmj3t5tyh/video/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      return data.secure_url;
    }
  };

  const handleSend = async () => {
    if (!text.trim() && !SelectedFile) return;
    if (!socketRef.current) return;
    setisSending(true);
    let fileUrl = null;
    let fileType = null;

    if (SelectedFile) {
      fileType = SelectedFile.type.startsWith("video") ? "video" : "image";

      fileUrl = await uploadImage(SelectedFile, fileType);
    }

    socketRef.current.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId: SelectedUser,
      text,
      image_link: fileUrl,
      type: fileType,
    });
    setSelectedFile(null);
    setpreview(null);
    setText("");
    setShowEmoji(false);
    setisSending(false);
  };

  const handleAddFriend = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/user/addFriend`, data, {
        withCredentials: true,
      });

      if (response.data.success) {
        const res = await axios.get(`${API_URL}/user/friendList`, {
          withCredentials: true,
        });
        setFriendList(res.data.friends || []);
        setRequestList(res.data.requests);
      }
    } catch (err) {
      console.error("Error adding friend:", err);
    }
  };
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    console.log("clicked ");

    // Detect preview type
    if (file.type.startsWith("image/")) {
      setpreviewType("image");
    } else if (file.type === "application/pdf") {
      setpreviewType("pdf");
    } else if (file.type.startsWith("video/")) {
      setpreviewType("video");
    } else {
      setpreviewType(null);
    }

    setSelectedFile(file);
    setpreview(URL.createObjectURL(file));
  };
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (MessageRequest === "You both are friends.") {
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 4000);

      const hideTimer = setTimeout(() => {
        setMessageRequest(false);
        setFadeOut(false);
      }, 5000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [MessageRequest]);

  const handleEmojiClick = (emoji) => {
    setText((prev) => prev + emoji.emoji);
  };

  return (
    <div className="h-full min-h-0 rounded-xl shadow-xl backdrop-blur-lg bg-white/10 border border-white/20 flex flex-col">
      {isFriend ? (
        <>
          {/* Header */}
          <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
            <span className="flex items-center gap-2 cursor-pointer" onClick={()=>{setShowMobileRightSidebar(true)}}>
              <img
                src={SelectedUserDetails.profilepic}
                alt={SelectedUserDetails.fullname}
                className="w-8 aspect-square rounded-full object-cover"
              />
              <p className="flex-1 text-lg text-white flex items-center gap-2">
                {SelectedUserDetails.fullname}
              </p>
              <span
                className={`rounded-full w-2 h-2 ${
                  SelectedUserDetails.status === "online"
                    ? "bg-green-300"
                    : "bg-gray-300"
                }`}
              ></span>
            </span>
            <span className="ml-auto">
              <button
                onClick={() => {
                  setSelectdUser(null);
                  setSelectedUserDetails(null);
                }}
                className="cursor-pointer mr-auto text-2xl  font-bold text-black md:hidden"
              >{`< |`}</button>
            </span>
          </div>

          {MessageRequest && (
            <div
              className={`mx-4 mt-2 mb-3 p-3 rounded-xl bg-yellow-500/20 border border-yellow-400/30 
                backdrop-blur-lg shadow-md flex items-center gap-3
                transition-opacity duration-700 
                ${fadeOut ? "opacity-0" : "opacity-100"}`}
            >
              <span className="text-yellow-300 text-xl"></span>
              <p className="text-yellow-200 text-sm leading-tight">
                {MessageRequest}
              </p>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar p-3 flex flex-col">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  message.senderId === currentUser._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`mt-3 p-2 text-white min-w-18 max-w-[70%] break-words whitespace-pre-wrap ${
                    message.senderId === currentUser._id
                      ? "ml-auto mr-8 rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-purple-700"
                      : "mr-auto ml-8 rounded-tl-xl rounded-tr-xl rounded-br-xl bg-purple-500"
                  }`}
                >
                  {message.text}

                  {/* IMAGE */}
                  {message.type === "image" && (
                    <img
                      src={message.image_link}
                      alt="sent-media"
                      className="w-48 rounded-lg mt-2"
                    />
                  )}

                  {/* VIDEO */}
                  {message.type === "video" && (
                    <video
                      src={message.image_link}
                      controls
                      className="w-48 rounded-lg mt-2"
                    />
                  )}

                  {/* AUDIO */}
                  {message.mediaType === "audio" && (
                    <audio controls className="mt-2 w-full">
                      <source
                        src={message.mediaUrl}
                        type={`audio/${message.format}`}
                      />
                    </audio>
                  )}
                  <br />
                  <p className="text-gray-300 text-[9px] ml-auto ">
                    {message.time}
                  </p>
                </div>

                <img
                  src={
                    message.senderId === currentUser._id
                      ? currentUser.profilepic
                      : SelectedUserDetails.profilepic
                  }
                  className={`w-8 object-cover aspect-square rounded-full ${
                    message.senderId === currentUser._id ? "ml-auto" : "mr-auto"
                  }`}
                />
              </div>
            ))}
            <div ref={bottomRef}></div>
          </div>
          {preview && (
            <div className="w-full flex justify-center mb-2">
              <div className="relative">
                {/* Remove preview button */}
                <button
                  onClick={() => {
                    setpreview(null);
                    setSelectedFile(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2"
                >
                  ✕
                </button>

                {/* Image preview */}
                {previewType === "image" && (
                  <img
                    src={preview}
                    className="h-20 w-20 object-cover rounded-lg shadow-md"
                  />
                )}

                {/* Video preview */}
                {previewType === "video" && (
                  <video
                    src={preview}
                    className="h-20 w-20 rounded-lg shadow-md"
                    muted
                    autoPlay
                    loop
                  />
                )}
              </div>
            </div>
          )}

          {/* Message input */}
          <div className="relative flex justify-center items-center mb-3 mt-3 gap-3">
            {showEmoji && (
              <div className="absolute bottom-12 right-24 z-50" ref={emojiRef}>
                <EmojiPicker theme="dark" onEmojiClick={handleEmojiClick} />
              </div>
            )}

            <button
              className="text-2xl text-white cursor-pointer"
              onClick={() => setShowEmoji(!showEmoji)}
            >
              😊
            </button>
            {/* Attach Media Button */}
            <button
              className="text-2xl text-white cursor-pointer"
              onClick={() => document.getElementById("mediaInput").click()}
            >
              🖇️
            </button>

            {/* Hidden File Input */}
            <input
              type="file"
              id="mediaInput"
              accept="image/*, video/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={isSending ? "Sending ..." : "Type Your Message"}
              className="w-[70%] h-10 bg-purple-600 rounded-4xl p-5 text-white placeholder:text-center"
            ></input>

            <button onClick={handleSend} className="text-white text-lg">
              ➤
            </button>
          </div>
        </>
      ) : (
        // not a friend

        <div className="h-full flex items-center justify-center">
          <div className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg max-w-sm mx-auto">
            <img
              src={SelectedUserDetails?.profilepic}
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
            />
            <h2 className="text-2xl font-semibold text-white mb-2">
              {SelectedUserDetails?.fullname}
            </h2>
            <p className="text-white/70 mb-6">
              This user is not in your friend list yet.
            </p>
            <button
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
              onClick={() => handleAddFriend(SelectedUserDetails)}
            >
              ➕ Add Friend
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
