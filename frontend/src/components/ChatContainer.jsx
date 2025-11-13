import DummyUser from "../assets/DummyUser";
import DummyMessages from "../assets/DummyMessages";
import { io } from "socket.io-client";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
console.log("📦 ChatContainer file loaded");

const socket = io("http://localhost:5000", {
  withCredentials: true,
});
const ChatContainer = ({ SelectedUser, setSelectedUSer,currentUser,SelectedUserDetails }) => {
  console.log(SelectedUserDetails)
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // ✅ Load previous chat messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!SelectedUser) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/user/${SelectedUser}`,
          { withCredentials: true }
        );
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [SelectedUser]);

  // ✅ Handle socket connection & incoming messages
  useEffect(() => {
    if (!currentUser?._id) return;

    // // Register current user when connected
    // socket.emit("registerUser", currentUser._id);

    // Listen for received messages
    socket.on("receiveMessage", (newMessage) => {
      if (
        newMessage.senderId === SelectedUser ||
        newMessage.receiverId === SelectedUser
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    // Listen for confirmation of sent message
    socket.on("messageSent", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messageSent");
    };
  }, [SelectedUser, currentUser]);

  const handleSend = async () => {
    if (!text.trim()) return;
    socket.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId: SelectedUser,
      text,
    });
    setText("");
  };


  return (
    <div className=" h-full min-h-0 rounded-xl shadow-xl backdrop-blur-lg bg-white/10 border border-white/20 flex flex-col">
      {/* header */}
      {/* friend profile pic, name,online status */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={SelectedUserDetails.ProfilePic}
          alt={SelectedUserDetails.fullname}
          className="w-8 aspect-square rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {SelectedUserDetails.fullname}
          <span
            className={`rounded-full w-2 h-2 ${
              SelectedUserDetails.Online ? "bg-green-300" : "bg-gray-300"
            }`}
          ></span>
        </p>
      </div>

      {/* chat messages */}
      <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar p-3 flex flex-col">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              message.senderId === currentUser._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`  mt-3 p-2 h-fit text-white flex flex-col min-w-18 ${
                message.senderId === currentUser._id
                  ? "ml-auto mr-8 rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-purple-700"
                  : "mr-auto ml-8 rounded-tl-xl rounded-tr-xl rounded-br-xl bg-purple-500"
              }`}
            >
              {message.text}
              <p className="text-gray-300 text-[9px] ml-auto ">
                {"message.time"}
              </p>
            </div>
            <img
              src={`${message.senderId === currentUser._id ? currentUser.ProfilePic : SelectedUserDetails.ProfilePic}`}
              alt={SelectedUserDetails.fullname}
              className={`w-8 aspect-square rounded-full ${
                message.senderId === currentUser._id ? "ml-auto" : "mr-auto"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center mb-3 mt-3 gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type Your Message"
          className=" w-[80%] h-10 bg-purple-600 rounded-4xl p-5 text-white placeholder:text-center"
        ></input>
        <button onClick={handleSend}>send</button>
      </div>
    </div>
  );
};

export default ChatContainer;
