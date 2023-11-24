const express = require("express");

const router = express.Router();

const { isAuthenticated, isAuthorized } = require("../middlewares/auth");

const {
  register,
  login,
  logout,
  updatePassword,
  updateProfile,
  deleteMyProfile,
  myProfile,
  getUserProfile,
  getAllUsers,
  forgotPassword,
  resetPassword,
} = require("../controllers/user");

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").get(isAuthenticated, logout);

router.route("/update/password").post(isAuthenticated, updatePassword);

router.route("/update/profile").post(isAuthenticated, updateProfile);

router.route("/delete/me").delete(isAuthenticated, deleteMyProfile);

router.route("/me").get(isAuthenticated, myProfile);

router.route("/getuser/:id").get(isAuthenticated, getUserProfile);

router.route("/getall").get(isAuthenticated, isAuthorized, getAllUsers);

router.route("/forgot/password").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);
module.exports = router;
