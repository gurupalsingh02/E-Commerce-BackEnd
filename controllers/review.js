const Review = require("../models/Review");
const Product = require("../models/Product");
exports.createReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }
    req.body.user = req.user;
    req.body.product = product;
    const review = await Review.create(req.body);
    res.status(200).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getAllReview = async (req, res) => {
  try {
    const reviews = await Review.find({product:req.params.id});
    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSingleReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if(!review){
        return res.status(404).json({
            success:false,
            message:"Review not found",
        });
    }
    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
          return res.status(400).json({
            success: false,
            message: "Review not found",
          });
        }
        if(review.user.toString()!==req.user._id.toString()){
            return res.status(401).json({
                success: false,
                message: "You are not authorized to update this review",
              });
        }
        const {title,comment,rating} = req.body;
        if(!title)review.title = title;
        if(!comment)review.comment = comment;
        if(!rating)review.rating = rating;
        await review.save();
        res.status(200).json({
          success: true,
          message: "Review Updated successfully",
          review,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
          return res.status(400).json({
            success: false,
            message: "Review not found",
          });
        }
        if(review.user.toString()!==req.user._id.toString()){
            return res.status(401).json({
                success: false,
                message: "You are not authorized to delete this review",
              });
        }
        await review.deleteOne();
        res.status(200).json({
          success: true,
          message: "Review Deleted successfully",
          review,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
};
