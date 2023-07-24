const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const cookie = require("cookie");
//model
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    require: [true, "Please send username"],
  },
  email: {
    type: String,
    require: [true, "Please send email"],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "Please send password"],
    minlength: [6, "Password should be more than 6 char"],
  },
  customerId: {
    type: String,
    default: "",
  },
  subscriptionType: {
    type: String,
    default: "",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//match password

userSchema.methods.matchPassword = async function (password) {
  //compare password
  return await bcrypt.compare(password, this.password);
};
//sign token

userSchema.methods.getSignedToken = function (res) {
    accessToken = JWT.sign({ id: this._id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE,
  });
  const refreshToken = JWT.sign(
    { id: this._id },
    process.env.JWT_REFRESH_TOKEN,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIREIN,
    }
  );
  res.cookie("refreshToken", `${refreshToken}`, {
    maxAge: 86400 * 7000,
    httpOnly: true,
  });
};

let User = mongoose.model("user", userSchema);

module.exports = {
  User,
};
