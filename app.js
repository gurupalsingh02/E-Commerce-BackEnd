const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./config/config.env" });
}

//using middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Importing routes
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const reviewRoutes = require("./routes/review");

// using routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);


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
