const express = require("express");
const { getAllUsers, showCurrentUser, updateUser, updateUserPassword, getSingleUser } = require("../controllers/user_controller");
const { isAuthanticated } = require("../middleware/authantication");
const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/showme").get(isAuthanticated,showCurrentUser);
router.route("/updateuser").patch(isAuthanticated,updateUser);
router.route("/updateuserpassword").patch(isAuthanticated,updateUserPassword);
router.route("/:id").get(getSingleUser);

module.exports = router;