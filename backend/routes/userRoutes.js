const express = require("express");
const {
  signUp,
  login,
  updateProfile,
  logout,
} = require("../controllers/userController");
const protectRoute = require("../middleware/auth");

const userRouter = express.Router();
userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/updateprofile", protectRoute, updateProfile);

module.exports = userRouter;
