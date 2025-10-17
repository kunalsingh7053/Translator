const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");


async function register(req,res){
    const {fullName:{firstName,lastName},email,password} = req.body;

    const  isUserAlereadyExists = await userModel.findOne({email})

    if(isUserAlereadyExists){
        return res.status(400).json({message:"User already exists"})
     
    }
    const user = await userModel.create({
        fullName:{
            firstName,
            lastName
        },
        email,
        password:await bcrypt.hash(password,8)
    })
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
    res.cookie("token",token)
    res.status(201).json({
        message:"User registered successfully",
        user:{
            id:user._id,
            email:user.email,
            fullName:user.fullName// send as object, not string
  
        }
    })
}
async function login(req,res){
    const {email,password} = req.body;
    const user = await userModel.findOne({
        email
    })
    if(!user){
        return res.status(400).json({message:"Invalid email "})
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
return res.status(400).json({message:"Invalid password"})
    }
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
    res.cookie("token",token)
    res.status(200).json({
        message:"User logged in successfully",
        user:{
            id:user._id,
            email:user.email,
            fullName:user.fullName// send as object, not string
        }
    })
}
async function logout(req,res){
    res.clearCookie("token")
    res.status(200).json({message:"User logged out successfully"})
}

module.exports = {

    register,
    login,
    logout
}