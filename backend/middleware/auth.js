const jwt = require("jsonwebtoken");
const User = require("../Model/User");

// middleware to protect routes

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (token) {
      const deecode = await jwt.verify(token, process.env.JWTSECRET);
      console.log(deecode);
      const user = await User.findById(deecode);
      if (user) {
        res.user = user.id;
        next();
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "user not found" });
  }
};

module.exports = protectRoute;
