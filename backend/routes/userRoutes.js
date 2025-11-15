const express = require("express");
const {
  signUp,
  login,
  updateProfile,
  logout,
  friendList,
  addFriend,
  acceptRequest,
} = require("../controllers/userController");
const protectRoute = require("../middleware/auth");
const { searchFriendsUserforSidebar, getMessages } = require("../controllers/messageController");

const userRouter = express.Router();
userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/updateprofile", protectRoute, updateProfile);
userRouter.get("/friendList",protectRoute,friendList)
userRouter.get("/searchfriend",protectRoute,searchFriendsUserforSidebar)
userRouter.get("/:receiverId",protectRoute ,getMessages)
userRouter.post("/addFriend",protectRoute,addFriend)
userRouter.post("/acceptRequest",protectRoute,acceptRequest)
module.exports = userRouter;
