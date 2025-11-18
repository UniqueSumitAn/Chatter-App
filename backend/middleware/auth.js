const jwt = require("jsonwebtoken");
const User = require("../Model/User");

// middleware to protect routes

const protectRoute = async (req, res, next) => {
  try {
    
    const token = req.cookies?.token;
    if (token) {
      const deecode = await jwt.verify(token, process.env.JWTSECRET);
     
      const user = await User.findById(deecode.id).select("-password");
      if (user) {
        req.user = user;
        req.id=deecode;
        
        next();
      }
    }
    else{ ("no token found")}
  } catch (error) {
     ;
    res.json({ success: false, message: "user not found" });
  }
};

module.exports = protectRoute;
