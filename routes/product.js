const express = require("express");

const router = express.Router();

const { isAuthenticated} = require("../middlewares/auth");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getAllProducts,
  getSingleProduct,
  getProductReviews,
  addToCart,
  removeFromCart,
  getCart,
} = require("../controllers/product");

router.route("/create").post(isAuthenticated, createProduct);
router.route("/update/:id").post(isAuthenticated, updateProduct);
router.route("/delete/:id").delete(isAuthenticated, deleteProduct);
router.route("/myproducts").get(isAuthenticated, getMyProducts);
router.route("/getall").get(isAuthenticated, getAllProducts);
router.route("/getproduct/:id").get(isAuthenticated, getSingleProduct);
router.route("/cart/add/:id").post(isAuthenticated, addToCart);
router.route("/cart/remove/:id").post(isAuthenticated, removeFromCart);
router.route("/cart/get").get(isAuthenticated, getCart);

module.exports = router;
