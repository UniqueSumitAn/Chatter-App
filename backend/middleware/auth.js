const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const connectDB = require("../lib/db");

// middleware to protect routes

const protectRoute = async (req, res, next) => {
  try {
    await connectDB(); // render
    const token = req.cookies?.token;
    if (!token) {
      console.log("token error protect route rejected");
      return res.json({ success: false, message: "user not found" });
    }
    if (token) {
      const deecode = await jwt.verify(token, process.env.JWTSECRET);

      const user = await User.findById(deecode.id).select("-password");
      if (user) {
        req.user = user;
        req.id = deecode;

        next();
      }
    } else {
      ("no token found");
    }
  } catch (error) {
    res.json({ success: false, message: "user not found" });
  }
};

module.exports = protectRoute;
