const generateToken = require("../lib/utils/utils");
const User = require("../Model/User");
const bcrypt = require("bcrypt");
const cloudinary = require("../lib/Cloudinary");
const cookie = require("cookie");
// sign up a new user
const signUp = async (req, res) => {
  const { email, fullname, password, profilepic, friends } = req.body;
  try {
    if (!fullname || !email || !password) {
      return res.json({ success: false, message: "missing fields" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "user already exist" });
    }
    const newUser = new User({
      email,
      fullname,
      password,
      profilepic,
      friends,
      status: "online",
    });

    await newUser.save();
    const savedUser = await User.findById(newUser._id).select("-password");
    const token = generateToken(newUser._id.toString());
    await res.cookie("token", token, {
      httpOnly: true, // JS on frontend cannot access (good)
      secure: false, // set true if using HTTPS (production)
      sameSite: "lax", // allows sending cookie with cross-origin requests
    });

    return res.json({
      success: true,
      user: savedUser,
      user_id: savedUser._id,
      email: email,
      message: "user created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.json({ success: false, message: "Invalid Credentials" });
  try {
    const user = await User.findOne({ email });

    if (!user) return res.json({ success: false, message: "user not found" });
    if (user) {
      const checkpassword = await bcrypt.compare(password, user.password);

      if (!checkpassword)
        return res.json({ success: false, message: "check password" });
      if (checkpassword) {
        // ✅ Update status to "online"
        user.status = "online";
        await user.save();
        const token = generateToken(user._id);
        await res.cookie("token", token, {
          httpOnly: true, // JS on frontend cannot access (good)
          secure: false, // set true if using HTTPS (production)
          sameSite: "lax", // allows sending cookie with cross-origin requests
        });
        const userWithoutPassword = await User.findById(user._id).select(
          "-password"
        );
        return res.json({
          success: true,
          message: "user logged in successfully",
          user: userWithoutPassword,
          user_id: user._id,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// to update user profile details
const updateProfile = async (req, res) => {
  try {
    const { email, fullname, password, profilepic } = req.body;
    const userId = req.user;
    let updateddata;
    if (!profilepiic) {
      updateddata = await User.findByIdAndUpdate(
        userId,
        { fullname, email, password },
        { new: true }
      );
    } else {
      const upload = await cloudinary.UploadStream.upload(profilepic);
      updateddata = await User.findByIdAndUpdate(
        userId,
        { profilepic: upload.secure_url, fullname, password, email },
        { new: true }
      );
    }
    return res.json({ success: true, user: updateddata });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//accept requests
const acceptRequest = async (req, res) => {
  const userId = req.user._id; // current user
  const friendId = req.body._id; // sender of request

  try {
    // 1️⃣ Update current user (add friend + remove request)
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { friends: friendId },
        $pull: { requests: friendId },
      },
      { new: true }
    );

    // 2️⃣ Update sender of request (add current user as friend)
    await User.findByIdAndUpdate(
      friendId,
      {
        $addToSet: { friends: userId },
        $pull: { requests: userId },
      },
      { new: true }
    );

    // 3️⃣ Fetch updated user with populated friends

    const updatedUser = await User.findById(userId)
      .populate("friends", "fullname email profilepic status")
      .populate("requests", "fullname email profilepic status");

    // 4️⃣ Format for frontend

    const requestsList = updatedUser.requests.map((reqUser) => ({
      _id: reqUser._id,
      fullname: reqUser.fullname,
      email: reqUser.email,
      profilepic: reqUser.profilepic,
      status: reqUser.status,
    }));
    console.log(req.body);
    return res.json({
      success: true,
      newFriend: req.body,
      requests: requestsList,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error accepting request" });
  }
};

//add friend
const addFriend = async (req, res) => {
  const senderId = req.user._id; // person sending request
  const receiverId = req.body._id; // person receiving request

  try {
    // Add sender to receiver's request list
    await User.findByIdAndUpdate(
      receiverId,
      {
        $addToSet: { requests: senderId },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      senderId,
      {
        $addToSet: { friends: receiverId },
      },
      { new: true }
    );

    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Failed to send request" });
  }
};

// friendList
const friendList = async (req, res) => {
  const userId = req.user._id;

  // 1️⃣ Populate friends AND requests at same time
  const user = await User.findById(userId)
    .populate("friends", "fullname email profilepic status")
    .populate("requests", "fullname email profilepic status");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // 2️⃣ Prepare friends list
  const friendsList = user.friends.map((friend) => ({
    _id: friend._id,
    fullname: friend.fullname,
    email: friend.email,
    profilepic: friend.profilepic,
    status: friend.status,
  }));

  // 3️⃣ Prepare requests list
  const requestsList = user.requests.map((reqUser) => ({
    _id: reqUser._id,
    fullname: reqUser.fullname,
    email: reqUser.email,
    profilepic: reqUser.profilepic,
    status: reqUser.status,
  }));
  console.log(user, "227");
  // 4️⃣ Send response
  return res.status(200).json({
    success: true,
    message: "Friend list & requests fetched successfully",
    friends: friendsList, // 👈 separate variable
    requests: requestsList, // 👈 separate variable
  });
};

//logout
const logout = async (req, res) => {
  try {
    // Optional: update user status

    // if (req.userId) {
    //   const user = await User.findById(req.userId);
    //   if (user) {
    //     user.status = "offline";
    //     await user.save();
    //   }
    // }

    // ✅ Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
    });

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};

module.exports = {
  signUp,
  login,
  updateProfile,
  logout,
  friendList,
  addFriend,
  acceptRequest,
};
