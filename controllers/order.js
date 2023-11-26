const Product = require("../models/Product");
const Order = require("../models/Order");
exports.createOrder = async (req, res) => {
  try {
    const cartItems = req.user.cart;
    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }
    let subtotal = 0;
    let orderItems = [];
    for (const item of cartItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: "Product not found",
        });
      }
      if (product.inventory < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Product out of stock only ${product.inventory} left`,
        });
      }
      subtotal += product.price * item.quantity;
      product.inventory -= item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });
      await product.save();
    }
    const shippingFee = 40;
    const total = subtotal + shippingFee;
    const order = await Order.create({
      tax: 0,
      shippingFee,
      subtotal,
      total,
      cartItems: orderItems,
      user: req.user._id,
      address: req.body.address,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
    });
    return res.status(200).json({
      success: true,
      total,
      message: `Order Placed Successfully for address : ${order.address}, ${order.street}, ${order.city}, ${order.state}`,
      Note:"Order can be cancelled only within 30 minutes of placing it",
      paymentMethod: "cash on Delievery",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    if (!orders) {
      return res.status(404).json({
        success: false,
        message: "You haven't placed any order yet",
      });
    }
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    if(order.user.toString()!==req.user._id.toString()){
        return res.status(401).json({
          success: false,
          message: "you do not have permission to cancel this product",
        });
      }
    const time = new Date(order.createdAt).getTime()+ 30*60*1000;
    console.log(time+"        "+Date.now());
    if(time < Date.now()){
      return res.status(401).json({
        success: false,
        message: "Order can't be cancelled now",
      });
    }
    res.status(200).json({
      success: true,
      message: "Order canceled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
