const jwt = require("jsonwebtoken");
const User = require("../Model/User");

// middleware to protect routes

const protectRoute = async (req, res, next) => {
  try {
    console.log("hii protect route")
    const token = req.cookies?.token;
    if (token) {
      const deecode = await jwt.verify(token, process.env.JWTSECRET);
      console.log(deecode,"protect route");
      const user = await User.findById(deecode.id).select("-password");
      if (user) {
        req.user = user;
        req.id=deecode;
        
        next();
      }
    }
    else{console.log("no toke found")}
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "user not found" });
  }
};

module.exports = protectRoute;
