const express = require("express");
const {
  signUp,
  login,
  updateProfile,
  logout,
  friendList,
  addFriend,
  acceptRequest,
  checkFriendList,
  declineRequest,
} = require("../controllers/userController");
const protectRoute = require("../middleware/auth");
const {
  searchFriendsUserforSidebar,
  getMessages,
} = require("../controllers/messageController");
const upload = require("../lib/Multer");

const userRouter = express.Router();
userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
userRouter.post(
  "/updateprofile",
  protectRoute,
  upload.single("profilepic"),
  updateProfile
);
userRouter.get("/friendList", protectRoute, friendList);
userRouter.get("/searchfriend", protectRoute, searchFriendsUserforSidebar);
userRouter.get("/:receiverId", protectRoute, getMessages);
userRouter.post("/addFriend", protectRoute, addFriend);
userRouter.post("/acceptRequest", protectRoute, acceptRequest);
userRouter.post("/checkFriendList", protectRoute, checkFriendList);
userRouter.post("/declinerequest", protectRoute, declineRequest);

module.exports = userRouter;
