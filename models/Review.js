const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide review title"],
      maxlength: [100, "Review title can not be more than 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Please provide review comment"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.post("save", function () {
  this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post("deleteOne", function () {
  this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);
