const { isTokenValid } = require("../utils/jwt");

exports.isAuthanticated = async(req,res,next)=>{
    const token = req.signedCookies.token;
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Please login first"
        });
    }
    const validToken = isTokenValid({token});
    if(!validToken){
        return res.status(401).json({
            success:false,
            message:"Please login first"
        });
    }
    console.log(validToken);
    next();
};