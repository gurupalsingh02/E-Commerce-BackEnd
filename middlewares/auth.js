const User = require("../models/User");
const jwt = require("jsonwebtoken");
exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please Log in first",
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Please Log in first",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
exports.isAuthorizedTo = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please Log in first",
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Please Log in first",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};