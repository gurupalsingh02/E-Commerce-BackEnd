const User = require("../models/user");
const { attachCookiesToResponce } = require("../utils/jwt");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }
  const newUser = await User.create({ name, email, password });
  attachCookiesToResponce({ res, user: newUser });
  res.status(201).json({ success: true, newUser });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(500).json({
      success: false,
      message: "Email is required",
    });
  }
  if (!password) {
    return res.status(500).json({
      success: false,
      message: "Password is required",
    });
  }
  const user = await User.findOne({ email }).select("+password");
  console.log(user);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User does not exist",
    });
  }
  const isPasswordCorrect = await user.comparePassword({ user, password });
  if (!isPasswordCorrect) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  attachCookiesToResponce({ res, user });
  res.status(201).json({ success: true, user });
};

exports.logout = async (req, res) => {
    res.cookie('token','logout',{
        httpOnly:true,
        expires:new Date(Date.now()),
    });
    res.status(200).json({success:true,message:"Logged out successfully"});
};
