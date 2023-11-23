const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const validator = require('validator');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a Name"],
  },
  email: {
    type: String,
    required: [true, "Please enter a Email"],
    unique: [true, "Email already exists"],
    validate: {
      validator: validator.isEmail,
      message: "Please Provide a valid email",
    },
  },
  imageUrl:{
    type:String,
    required:[true,"Please enter a Image Url"],
  },
  password: {
    type: String,
    required: [true, "Please enter a Password"],
    unique: [true, "Email already exists"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
    
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function (password) {
  console.log(password + "  " + this.password);
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function () {
  console.log(process.env.JWT_SECRET);
  return await jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  console.log(resetToken);
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
module.exports = mongoose.model("User", userSchema);
