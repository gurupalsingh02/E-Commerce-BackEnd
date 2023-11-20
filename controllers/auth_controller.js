const User = require("../models/user");

exports.register = async (req,res)=>{
    const {name,email,password} = req.body;
    const user = await User.findOne({email});
    if(user){
        return res.status(400).json({success:false,message:"User already exists"});
    }
    const newUser = await User.create({name,email,password});
    res.status(201).json({success:true,newUser});
}

exports.login = async (req,res)=>{
    console.log('register');
}

exports.logout = async (req,res)=>{
    console.log('register');
}