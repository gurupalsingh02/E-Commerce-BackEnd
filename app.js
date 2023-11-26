const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const rateLimiter = require("express-rate-limit");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./config/config.env" });
}

//using middlewares
app.set("trust proxy", 1);
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Importing routes
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const reviewRoutes = require("./routes/review");
const orderRoutes = require("./routes/order");

// using routes
app.route("/").get((req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Ecommerce API",
  });
});
app.route("/documentation").get((req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/orders", orderRoutes);

// Error handler middleware
app
  .route("*")
  .get((req, res) => {
    return res.status(404).json({ success: false, message: "Page not found" });
  })
  .post((req, res) => {
    return res.status(404).json({ success: false, message: "Page not found" });
  })
  .patch((req, res) => {
    return res.status(404).json({ success: false, message: "Page not found" });
  })
  .delete((req, res) => {
    return res.status(404).json({ success: false, message: "Page not found" });
  })
  .put((req, res) => {
    return res.status(404).json({ success: false, message: "Page not found" });
  });

module.exports = app;
