import DummyUser from "../assets/DummyUser";
import DummyMessages from "../assets/DummyMessages";
import { io } from "socket.io-client";
import { useEffect } from "react";
console.log("📦 ChatContainer file loaded");
const ChatContainer = ({ SelectedUser, setSelectedUSer }) => {
  const User = DummyUser.find((user) => user.Name == SelectedUser);
  useEffect(() => {
    console.log("🚀 useEffect running in ChatContainer", SelectedUser);

    const socket = io("http://localhost:5000", {
      withCredentials: true,
    });
    socket.on("connect", () => {
      console.log("id:", socket.id);
    });
    socket.on("socketid", (data) => {
      console.log(data);
    });
    socket.on("connect_error", (err) => {
      console.error("Socket connection failed:", err.message);
    });

    return () => {
      socket.disconnect();
      console.log("🔌 Socket disconnected");
    };
  }, []);
  return (
    <div className=" h-full min-h-0 rounded-xl shadow-xl backdrop-blur-lg bg-white/10 border border-white/20 flex flex-col">
      {/* header */}
      {/* friend profile pic, name,online status */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={User.ProfilePic}
          alt={User.Name}
          className="w-8 aspect-square rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {User.Name}
          <span
            className={`rounded-full w-2 h-2 ${
              User.Online ? "bg-green-300" : "bg-gray-300"
            }`}
          ></span>
        </p>
      </div>

      {/* chat messages */}
      <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar p-3 flex flex-col">
        {DummyMessages.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              message.type === "sent" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`  mt-3 p-2 h-fit text-white flex flex-col min-w-18 ${
                message.type === "sent"
                  ? "ml-auto mr-8 rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-purple-700"
                  : "mr-auto ml-8 rounded-tl-xl rounded-tr-xl rounded-br-xl bg-purple-500"
              }`}
            >
              {message.message}
              <p className="text-gray-300 text-[9px] ml-auto ">
                {message.time}
              </p>
            </div>
            <img
              src={`${message.type === "sent" ? "" : User.ProfilePic}`}
              alt={User.Name}
              className={`w-8 aspect-square rounded-full ${
                message.type === "sent" ? "ml-auto" : "mr-auto"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center mb-3 mt-3 gap-3">
        <input
          placeholder="Type Your Message"
          className=" w-[80%] h-10 bg-purple-600 rounded-4xl p-5 text-white placeholder:text-center"
        ></input>
        <button>send</button>
      </div>
    </div>
  );
};

export default ChatContainer;
