const { Server } = require("socket.io");
const User = require("../Model/User");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const Message = require("../Model/message");
const searchFriendsUserforSidebar = async (req, res) => {
  try {
    const search = req.query.query || "";
    if (!search.trim()) return res.json([]);
    // ✅ Find users whose fullname matches (case-insensitive partial match)
    const users = await User.find({
      _id: { $ne: req.id.id }, // exclude the user himself
      fullname: { $regex: search, $options: "i" },
    }).select("fullname email profilepic"); // only return necessary fields
    
    return res.json(users);
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Fetch chat history between two users
const getMessages = async (req, res) => {
  
  try {
    const senderId = req.id.id; // extracted from protectRoute middleware
    const receiverId = req.params.receiverId;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 }); // sort by time ascending

    return res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

const chat = (server) => {
  let onlineUsers = new Map();

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      return next(new Error("No cookies found"));
    }

    // Parse cookies
    const cookies = cookie.parse(cookieHeader);
    
    const token = cookies.token; // assuming cookie is named "token"
    
    if (!token) {
      return next(new Error("Authentication error: No token found in cookies"));
    }

    try {
      const decoded = jwt.verify(token, `${process.env.JWTSECRET}`);
      socket.user = decoded.id; // Attach decoded user info
      
      next();
    } catch (err) {
      return next(new Error("Invalid or expired token"));
    }
  });
  io.on("connection", async (socket) => {
    const socket_id = socket.id;
    const user_id = socket.user;
    if (user_id) {
      onlineUsers.set(user_id, socket.id);

      console.log(socket_id, "<-socketid::userid->", user_id);
      const user = await User.findByIdAndUpdate(
        `${user_id}`, // The user _id
        { $set: { socket_id: socket.id } }, // The update operation
        { new: true } // Return the updated document
      );
      
    }

    socket.emit("socketid", socket.id);

    socket.on("sendMessage", async (data) => {
      const { senderId, receiverId, text } = data;
      //check if reciever is online
      const receiverSocketId = onlineUsers.get(receiverId);
      //save message to db
      const newMessage = await Message.create({ senderId, receiverId, text });
      // ✅ Emit message to receiver (if online)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", newMessage);
        console.log("104 recievemessage emitted",receiverSocketId)
      }
      // emit message to sender to update senders ui
      io.to(socket.id).emit("messageSent", newMessage);
      console.log("108 recievemessage sent emitted")
    });

    socket.on("disconnect", async () => {
      let disconnectedUser = null;
      console.log("🔴75 User disconnected:", socket.id);
      // Find which user had this socket id
      for (const [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          disconnectedUser = userId;
          onlineUsers.delete(userId);
          break; // stop after finding
        }
      }
      if (disconnectedUser) {
        const user = await User.findById(disconnectedUser);
        if (user) {
          user.status = "offline";
          await user.save();
          console.log(onlineUsers,"  128")
        }
      }
    });
  });
};

module.exports = { searchFriendsUserforSidebar, chat, getMessages };
