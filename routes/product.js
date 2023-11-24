const express = require("express");

const router = express.Router();

const { isAuthenticated, isAuthorized } = require("../middlewares/auth");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getAllProducts,
  getSingleProduct,
  getProductReviews,
} = require("../controllers/product");

router.route("/create").post(isAuthenticated, isAuthorized, createProduct);
router.route("/update/:id").post(isAuthenticated, isAuthorized, updateProduct);
router.route("/delete/:id").delete(isAuthenticated, isAuthorized, deleteProduct);
router.route("/myproducts").get(isAuthenticated, getMyProducts);
router.route("/getall").get(isAuthenticated, getAllProducts);
router.route("/getproduct/:id").get(isAuthenticated, getSingleProduct);
router.route("/reviews/:id").get(isAuthenticated, getProductReviews);

module.exports = router;
