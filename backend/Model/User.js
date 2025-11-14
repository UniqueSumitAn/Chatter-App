const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    profilepic: { type: String, default: "" },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    socket_id: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Only hash if password was modified or newly set
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
