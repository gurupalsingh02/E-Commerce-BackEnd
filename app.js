const express = require("express");

const app = express();

const morgan = require("morgan");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./config/config.env" });
}

const cookie_parser = require("cookie-parser");
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookie_parser(process.env.JWT_SECRET));
app.use(express.urlencoded({ extended: true }));


// Routers
const authRoutes = require("./routes/auth_routes");
app.use("/api/v1/auth", authRoutes);

const userRoutes = require("./routes/user_routes");
app.use("/api/v1/users", userRoutes);

module.exports = app;
