const express = require("express");
const {
  createReview,
  updateReview,
  deleteReview,
  getAllReview,
  getSingleReview,
} = require("../controllers/review");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.route("/create/:id").post(isAuthenticated,createReview);
router.route("/update/:id").post(isAuthenticated,updateReview);
router.route("/delete/:id").delete(isAuthenticated,deleteReview);
router.route("/getall/:id").get(getAllReview);
router.route("/get/:id").get(getSingleReview);

module.exports = router;
