const { sendEmail } = require("../middlewares/sendEmail");
const User = require("../models/User");
const crypto = require("crypto");

exports.register = async (req, res) => {
  try {
    const { name, email, password,imageUrl,role} = req.body;
    let user = await User.findOne({ email });
    if(!role)role = 'user';
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "user already exists" });
    user = await User.create({
      name,
      email,
      password,
      imageUrl,
      role,
    });
    const token = await user.generateToken();
    console.log(token);
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(200).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user)
      res.status(400).json({
        success: false,
        message: "user does not exist",
      });

    const isMatch = await user.matchPassword(password);

    if (!isMatch)
      res.status(400).json({
        success: false,
        message: "incorrect password",
      });

    const token = await user.generateToken();
    console.log(token);
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(200).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {}
};

exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({
        success: false,
        message: "Please provide old and new password",
      });
    if (oldPassword === newPassword)
      return res.status(400).json({
        success: false,
        message: "Old and new password cannot be same",
      });
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old Password is Incorrect",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, email,imageUrl } = req.body;
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if(imageUrl){
      user.imageUrl = imageUrl;
    }
    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    await user.deleteOne();
    // logout User after deleting profile.
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    if(req.user.role==='user'&&req.user._id.toString()!==req.params.id){
      return res.status(401).json({
        success: false,
        message: "you do not have permission to access this user",
      });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const resetPasswordToken = user.getResetPasswordToken();
    await user.save();
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${resetPasswordToken}`;
    const message =
      "Reset Your password by clicking on the link below \n\n" + resetUrl;
    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset",
        message,
      });
      res.status(200).json({
        success: true,
        message: "Email sent successfully",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.resetPassword = async (req,res)=>{
try {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()}});
  if(!user){
    return res.status(401).json({
      success:false,
      message:'Invalid Token or Token Expired'
    });
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res.status(200).json({
    success:true,
    message:'Password Updated Successfully'
  });
} catch (error) {
  res.status(500).json({
    success: false,
    message: error.message,
  });
}
}