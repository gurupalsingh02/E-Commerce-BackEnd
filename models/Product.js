const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide product name"],
      maxlength: [100, "Product name can not be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
    },
    description: {
      type: String,
      required: [true, "Please provide product price"],
      maxlength: [1000, "Description can not be more than 1000 characters"],
    },
    image: {
      type: String,
      required: [true, "Please provide product image"],
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: [
        "office",
        "kitchen",
        "bedroom",
        "living room",
        "bathroom",
        "outdoor",
      ],
    },
    company: {
      type: String,
      required: [true, "Please provide product company"],
      enum: {
        values: ["ikea", "marcos", "caressa", "liddy", "caressa"],
        message: "{VALUE} is not supported",
      },
    },
    colors: {
      type: [String],
      required: [true, "Please provide product colors"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: [true, "Please provide product inventory"],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews:{
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("deleteOne", { document: true }, async function (next) {
  const product = this;
  await Review.deleteMany({ product: product._id });
  next();
});
module.exports = mongoose.model("Product", productSchema);
