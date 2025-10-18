const userModel = require("../models/user.model")
const bookmarkModel = require("../models/bookmark.model")
const  msgModel = require("../models/msg.model")
const chatfileModel = require("../models/chatfile.model")
const chatfolderModel = require("../models/chatfolder.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const uploadImg = require("../service/storage.service");


async function register(req,res){
    const {fullName:{firstName,lastName},email,password} = req.body;

    const  isUserAlereadyExists = await userModel.findOne({email})

    if(isUserAlereadyExists){
        return res.status(400).json({message:"User already exists kindly login"})
     
    }
    const user = await userModel.create({
        fullName:{
            firstName,
            lastName
        },
        email,
        password:await bcrypt.hash(password,8)
    })
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{ expiresIn:"7d"})
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
        return res.status(400).json({message:"Invalid email Please register first"})
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
return res.status(400).json({message:"Invalid password"})
    }
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{ expiresIn:"7d"})
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
async function getProfile(req,res){

res.json(req.user);
}
async function deleteProfile(req,res){

try {
    const userId = req.user._id;
    await  msgModel.deleteMany({user:userId})
    await bookmarkModel.deleteMany({user:userId})
    await chatfileModel.deleteMany({user:userId})
    await chatfolderModel.deleteMany({user:userId})
   const detectUser =   await userModel.findByIdAndDelete(userId)
    if(!detectUser){

        return res.status(404).json({message:"User not found"})
    }

    res.clearCookie("token")
    res.status(200).json({message:"User profile and associated data deleted successfully"})

} catch (error) {
    console.error("Error deleting user profile:", error);
    res.status(500).json({message:"Internal server error"})
    
}


}

async function updateProfile(req,res){

 try {
    const userId = req.user._id;
    const user = await userModel.findById({_id:userId});
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    const {firstName,lastName,oldpassword,newpassword,imgUrl} = req.body;
     // Verify old password if new password is provided
     const file = req.file;// Multer adds the file to req.file
     
  if (newpassword) {
   if (!oldpassword) {
     return res.status(400).json({ message: "Old password is required" });
   }
   const isValid = await bcrypt.compare(oldpassword, user.password);
   if (!isValid) {
     return res.status(400).json({ message: "Invalid Old Password" });
   }
}

      // Build update object
    const updateData = {};
    if (firstName) updateData['fullName.firstName'] = firstName;
    if (lastName) updateData['fullName.lastName'] = lastName;

        // Update profile image if file is uploaded
    if(file){
      const fileData = await uploadImg(file); //upload to Imagekit
        updateData.imgUrl = fileData.url;
    }

    if (newpassword) updateData.password = await bcrypt.hash(newpassword, 10);
     // Update user
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );
     res.status(200).json({
      message: "Profile updated successfully!",
      user: {
        _id: updatedUser._id,
        email: updatedUser.email,
        fullName: `${updatedUser.fullName.firstName} ${updatedUser.fullName.lastName}`,
        imgUrl: updatedUser.imgUrl,
      },

    });

 } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({message:"Internal server error"})
    
 }

}

module.exports = {

    register,
    login,
    logout,
    getProfile,
    deleteProfile,
    updateProfile
}