const express = require("express");

const app = express();

const morgan = require("morgan");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./config/config.env" });
}

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routers
const authRoutes = require("./routes/auth_routes");
app.use("/api/v1/auth", authRoutes);

module.exports = app;
