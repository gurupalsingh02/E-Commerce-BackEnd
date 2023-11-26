const Product = require("../models/Product");
const Review = require("../models/Review");
exports.createProduct = async (req, res) => {
  try {
    req.body.user = req.user;
    const product = await Product.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      user: req.user,
      message: error,
    });
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, inventory, colors, category, image } =
      req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }
    if(product.user.toString()!==req.user._id.toString()){
      return res.status(401).json({
        success: false,
        message: "you do not have permission to update this product",
      });
    }
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (inventory) product.inventory = inventory;
    if (colors) product.colors = colors;
    if (category) product.category = category;
    if (image) product.image = image;
    await product.save();
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }
    if(product.user.toString()!==req.user._id.toString()){
      return res.status(401).json({
        success: false,
        message: "you do not have permission to update this product",
      });
    }
    await product.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.addToCart = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }
    const cartItem = req.user.cart.find(
      (item) => item.product.toString() === product._id.toString()
    );
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      req.user.cart.push({ product: product._id, quantity: 1 });
    }
    await req.user.save();
    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: req.user.cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cartItem = req.user.cart.find(
      (item) => item.product.toString() === req.params.id.toString()
    );
    if (!cartItem) {
      return res.status(400).json({
        success: false,
        message: "Product not found in cart",
      });
    }
    if (cartItem) {
      cartItem.quantity -= 1;
    }
    if (cartItem.quantity == 0) {
      const index = req.user.cart.indexOf(req.params.id);
      req.user.cart.splice(index, 1);
    }
    await req.user.save();
    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      cart: req.user.cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = req.user.cart;
    let subtotal = 0;
    for (const item of cart) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not",
          product: item.product,
          name: item.name,
          item,
        });
      }
      subtotal += product.price * item.quantity;
      const shippingFee = 40;
      const total = subtotal + shippingFee;
      res.status(200).json({
        success: true,
        cart,
        subtotal,
        shippingFee,
        total,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
