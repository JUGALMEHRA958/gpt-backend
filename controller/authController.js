const errorHandler = require("../middlewares/errorMiddleware");
const userModel = require("../models/userModel");
const errorResponse = require("../utils/errorResponses");
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return next(new errorResponse("Email already registered", 500));
    }
    const user = await userModel.create(username, email, password);
    this.sendToken(user, 201, res);
  } catch (e) {
    console.log("Error ", e);
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new errorResponse("Please provide email/pass", 500));
    }
    const user = await userModel.findOne({ email, password });
    if (!user) {
      return next(new errorResponse("Invalid creds", 401));
    }
    const isMatch = await userModel.matchPassword(password);
    if (!isMatch) {
      return next(new errorHandler("Invalid username/password", 401));
    }
    this.sendToken(user, 200, res);
  } catch (e) {
    console.log("Error ", e);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken");
    res.send({ status: 0, message: "Logout success" });
  } catch (e) {
    console.log("Error ", e);
  }
};

//JWT token
exports.sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken;
  res.status(statusCode).json({
    status: 1,
    token,
  });
};
