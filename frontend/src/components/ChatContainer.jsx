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
const ChatContainer = ({
  SelectedUser,
  setSelectedUSer,
  currentUser,
  SelectedUserDetails,
  isFriend,
  setFriendList,
  friendList,
}) => {
  console.log(SelectedUserDetails, isFriend);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const handleAddFriend = async (data) => {
    console.log("button pressed 24", data);
    const response = await axios.post(
      "http://localhost:5000/user/addFriend",
      data,
      {
        withCredentials: true,
      }
    );
    if (response.data.success) {
      try {
        console.log("effect hit");
        const response = await axios.get(
          "http://localhost:5000/user/friendList",
          {
            withCredentials: true,
          }
        );
        console.log(response);
        setFriendList(response.data.friends || []); // ensure you handle empty responses safely
        console.log(friendList, "={friendList}");
      } catch (error) {
        console.error("Error fetching friend list:", error);
        setFriendList([]); // fallback if request fails
      }
    } else {
      console.log("Something went wrong");
    }
  };
  useEffect(() => {
    console.log("🆕18 Messages updated:", messages);
  }, [messages]);

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
      {isFriend && (
        <>
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
                  SelectedUserDetails.Online === "online"
                    ? "bg-green-300"
                    : "bg-gray-300"
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
                  message.senderId === currentUser._id
                    ? "justify-end"
                    : "justify-start"
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
                  src={`${
                    message.senderId === currentUser._id
                      ? currentUser.ProfilePic
                      : SelectedUserDetails.ProfilePic
                  }`}
                  alt={`${
                    message.senderId === currentUser._id
                      ? currentUser.fullname
                      : SelectedUserDetails.fullname
                  }`}
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
              onSubmit={handleSend}
              placeholder="Type Your Message"
              className=" w-[80%] h-10 bg-purple-600 rounded-4xl p-5 text-white placeholder:text-center"
            ></input>
            <button onClick={handleSend}>send</button>
          </div>
        </>
      )}

      {!isFriend && (
        <div className="h-full flex items-center justify-center">
          <div className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg max-w-sm mx-auto">
            <img
              src={SelectedUserDetails?.ProfilePic}
              alt={SelectedUserDetails?.fullname}
              className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-purple-400 shadow-md object-cover"
            />

            <h2 className="text-2xl font-semibold text-white mb-2">
              {SelectedUserDetails?.fullname}
            </h2>

            <p className="text-white/70 mb-6">
              This user is not in your friend list yet.
            </p>

            <button
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-xl shadow-md transition-all duration-200"
              onClick={() => {
                console.log("add friend clicked");
                handleAddFriend(SelectedUserDetails);
              }}
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
