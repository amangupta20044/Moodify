const userModel = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt  = require("jsonwebtoken")
const blackListModel = require("../models/blacklist.model")
const redis = require("../config/cache")

async function registerUser(req,res){
    const{username,email,password} = req.body;

    const isAllreadyRegister = await userModel.findOne({
        $or:[
            {email},
            {userName:username}
        ]
    })
    if(isAllreadyRegister){
        res.status(400).json({
            message:"user with the same name or email already exists"
        })
    }
    const hash  = await bcrypt.hash(password,10)

    const user = new userModel({
        userName:username,
        email,
        password:hash
    })
    await user.save()
    res.status(201).json({
        message:"user registered successfully",
        user:user
    })
    const token = jwt.sign({
        id:user._id,
        userName:user.userName,
    },process.env.JWT_SECRET_KEY,{expiresIn:"1h"})

    res.cookie("token",token)

    return res.status(201).json({
        message:"user registered successfully",
        id : user._id,
        userName:user.userName,
        email:user.email
    })
}

async function loginUser(req,res){
    const {email,password,userName} = req.body

    const user = await userModel.findOne({
        $or:[
            {email},
            {userName}
        ]
    }).select("+password")  
    if(!user){
        return res.status(400).json({
            message:"invalid Credential"
        })
    }
    const isPassswordValid = await bcrypt.compare(password,user.password)
    if(!isPassswordValid){
        return res.status(400).json({
            message:"invalid Credential"
        })
    }
    const token = jwt.sign({
        id:user._id,
        userName:user.userName,
    },process.env.JWT_SECRET_KEY,{expiresIn:"1h"})

    res.cookie("token",token)

    return res.status(200).json({
        message:"user logged in successfully",
        id : user._id,
        userName:user.userName,
        email:user.email,
    })
}
async function getMe(req,res){
    const user = await userModel.findById(req.user.id)

    res.status(201).json({
        message:"user fetched succesfully",
        user
    })
}
async function logoutUser(req,res) {
    const token = req.cookies.token

    res.clearCookie("token")

    // await blackListModel.create({
    //     token
    // })

    await redis.set(token,Date.now().toString(), "EX", 60 * 60) // Set token in Redis with an expiration time of 1 hour

    res.status(200).json({
        message:"user logged out successfully"
    })
}

module.exports = {registerUser,loginUser,getMe,logoutUser}
