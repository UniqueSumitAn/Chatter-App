import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const ChatContainer = ({
  SelectedUser,
  setSelectedUSer,
  currentUser,
  SelectedUserDetails,
  isFriend,
  setFriendList,
  friendList,
}) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!currentUser?._id) return;

    console.log("🔌 Connecting socket for user:", currentUser._id);

    socketRef.current = io("http://localhost:5000", {
      withCredentials: true,
      auth: { userId: currentUser._id },
    });

    socketRef.current.on("connect", () => {
      console.log("🟢 Socket Connected:", socketRef.current.id);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("🔴 Socket Disconnected");
      }
    };
  }, [currentUser]);

  // Load previous messages when user changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!SelectedUser) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/user/${SelectedUser}`,
          { withCredentials: true }
        );
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

  //  Setup listeners for incoming messages
  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    const handleReceive = ({ newMessage, time }) => {
      if (
        newMessage.senderId === SelectedUser ||
        newMessage.receiverId === SelectedUser
      ) {
        // Add time to the message for UI
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

  //  Send message
  const handleSend = () => {
    if (!text.trim()) return;
    if (!socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId: SelectedUser,
      text,
    });

    setText("");
  };

  //  Add friend
  const handleAddFriend = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/user/addFriend",
        data,
        { withCredentials: true }
      );

      if (response.data.success) {
        const res = await axios.get("http://localhost:5000/user/friendList", {
          withCredentials: true,
        });
        setFriendList(res.data.friends || []);
      }
    } catch (err) {
      console.error("Error adding friend:", err);
    }
  };

  return (
    <div className="h-full min-h-0 rounded-xl shadow-xl backdrop-blur-lg bg-white/10 border border-white/20 flex flex-col">
      {isFriend ? (
        <>
          {/*  Header */}
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

          {/*  Messages */}
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
                  className={`mt-3 p-2 text-white min-w-18 ${
                    message.senderId === currentUser._id
                      ? "ml-auto mr-8 rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-purple-700"
                      : "mr-auto ml-8 rounded-tl-xl rounded-tr-xl rounded-br-xl bg-purple-500"
                  }`}
                >
                  {message.text}
                  <br />
                  <p className="text-gray-300 text-[9px] ml-auto ">
                    {message.time}
                  </p>
                </div>

                <img
                  src={
                    message.senderId === currentUser._id
                      ? currentUser.ProfilePic
                      : SelectedUserDetails.ProfilePic
                  }
                  className={`w-8 aspect-square rounded-full ${
                    message.senderId === currentUser._id ? "ml-auto" : "mr-auto"
                  }`}
                />
              </div>
            ))}
            <div ref={bottomRef}></div>
          </div>

          {/*  Message Input */}
          <div className="flex justify-center items-center mb-3 mt-3 gap-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type Your Message"
              className="w-[80%] h-10 bg-purple-600 rounded-4xl p-5 text-white placeholder:text-center"
            ></input>
            <button onClick={handleSend}>send</button>
          </div>
        </>
      ) : (
        /*  NOT FRIEND UI */
        <div className="h-full flex items-center justify-center">
          <div className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg max-w-sm mx-auto">
            <img
              src={SelectedUserDetails?.ProfilePic}
              className="w-20 h-20 rounded-full mx-auto mb-4"
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
