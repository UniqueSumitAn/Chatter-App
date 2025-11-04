const { Server } = require("socket.io");
const User = require("../Model/User");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const searchFriendsUserforSidebar = async (req, res) => {
  try {
    const search = req.body;
    // ✅ Find users whose fullname matches (case-insensitive partial match)
    const isAvailable = await User.find({
      fullname: { $regex: search, $options: "i" },
    }).select("fullname email profilepic"); // only return necessary fields
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

const chat = (server) => {
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
    console.log(cookies)
    const token = cookies.token; // assuming cookie is named "token"
    console.log(token);
    if (!token) {
      return next(new Error("Authentication error: No token found in cookies"));
    }

    try {
      const decoded = jwt.verify(token, `${process.env.JWTSECRET}`);
      socket.user = decoded.id; // Attach decoded user info
      console.log(socket.user);
      next();
    } catch (err) {
      return next(new Error("Invalid or expired token"));
    }
  });
  io.on("connection", async (socket) => {
    const socket_id = socket.id;
    const user_id = socket.user;
    if (user_id) {
      console.log(socket_id, "<-socketid::userid->", user_id);
      // const user = await User.findOneAndUpdate({});
    }

    socket.emit("socketid", socket.id);
  });
};

module.exports = { searchFriendsUserforSidebar, chat };
