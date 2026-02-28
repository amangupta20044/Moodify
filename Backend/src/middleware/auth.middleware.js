const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const blackListModel = require("../models/blacklist.model")


async function authUser(req,res,next){
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            message:"token not provided"
        })
    }
    
    const isTokenBlackListed = await blackListModel.findOne({token})
    if(isTokenBlackListed){
        return res.status(401).json({
            message:"token is blacklisted"
        })
    }
    
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.user = decoded// attach the decoded user information to the request object for further use in the route handlers
        next()// call the next middleware or route handler
    } catch (error) {
        return res.status(401).json({
            message:"invalid token"
        })
    }
}

module.exports = {authUser}