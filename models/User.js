const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide your name"],
    maxLength: [30, "Your name cannot exceed 30 characters"],
    minLength: [4, "Your name should At Least 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Provide your email"],
    validate: {
      validator: validator.isEmail,
      message: "Please Provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please Provide your password"],
    minLength: [6, "Your password should be at least 6 characters"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (error) {
    console.log(error);
  }
});

userSchema.methods.comparePassword = async ({user,password}) => {
  console.log(password + "  " + user.password);
  return await bcrypt.compare(password, user.password);
};
module.exports = mongoose.model("User", userSchema);
