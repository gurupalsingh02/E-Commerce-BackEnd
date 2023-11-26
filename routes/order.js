const express = require("express");

const router = express.Router();

const { isAuthenticated } = require("../middlewares/auth");
const {} = require("../controllers/product");
const {
  createOrder,
  updateOrder,
  cancelOrder,
  getSingleOrder,
  getMyOrders,
} = require("../controllers/order");

router.route("/create").post(isAuthenticated, createOrder);
router.route("/cancel/:id").post(isAuthenticated, cancelOrder);
router.route("/get/:id").get(isAuthenticated, getSingleOrder);
router.route("/getall").get(isAuthenticated, getMyOrders);

module.exports = router;
