const { register, logout, login } = require("../controllers/auth_controller");

const router = require("express").Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);

module.exports = router;