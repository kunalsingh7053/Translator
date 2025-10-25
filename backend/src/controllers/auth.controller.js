const userModel = require("../models/user.model")
const bookmarkModel = require("../models/bookmark.model")
const  msgModel = require("../models/msg.model")
const chatfileModel = require("../models/chatfile.model")
const chatfolderModel = require("../models/chatfolder.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const crypto = require("crypto") // for hashing file buffer
const uploadImg = require("../service/storage.service");


async function register(req,res){
    const {fullName:{firstName,lastName},email,password,language} = req.body;

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
        password:await bcrypt.hash(password,8),
        language
    })
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{ expiresIn:"7d"})
res.cookie("token", jwtToken, {
  httpOnly: true,
  secure: true,       // must be true in production HTTPS
  sameSite: "none",   // required for cross-site cookies
  maxAge: 24 * 60 * 60 * 1000
});

    res.status(201).json({
        message:"User registered successfully",
        user:{
            id:user._id,
            email:user.email,
            fullName:user.fullName,// send as object, not string
            language:user.language
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
res.cookie("token", jwtToken, {
  httpOnly: true,
  secure: true,       // must be true in production HTTPS
  sameSite: "none",   // required for cross-site cookies
  maxAge: 24 * 60 * 60 * 1000
});


    res.status(200).json({
        message:"User logged in successfully",
        user:{
            id:user._id,
            email:user.email,
            fullName:user.fullName,// send as object, not string
             language:user.language        
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
const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Delete all user-related collections
    await Promise.all([
      msgModel.deleteMany({ user: userId }),
      bookmarkModel.deleteMany({ user: userId }),
      chatfileModel.deleteMany({ user: userId }),
      chatfolderModel.deleteMany({ user: userId }),
    ]);

    // 2️⃣ Find user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️⃣ Delete user image from ImageKit if exists
    if (user.imgFileId || user.imgUrl) {
      let fileId = user.imgFileId;

      // If only URL is stored, extract filename from URL
      if (!fileId && user.imgUrl) {
        try {
          const urlParts = user.imgUrl.split("/");
          fileId = urlParts[urlParts.length - 1].split("?")[0]; // Extract filename.jpg
        } catch (err) {
          console.error("Failed to extract ImageKit File ID from URL:", err);
        }
      }

      if (fileId) {
        try {
          const result = await imagekit.deleteFile(fileId);
          console.log("ImageKit deletion result:", result);
        } catch (imgErr) {
          console.error("Failed to delete image from ImageKit:", imgErr.response || imgErr);
        }
      }
    }

    // 4️⃣ Delete user from database
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 5️⃣ Clear token cookie and respond
    res.clearCookie("token");
    res.status(200).json({ message: "User profile and associated data deleted successfully" });
  } catch (error) {
    console.error("Error deleting user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



async function updateProfile(req, res) {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { firstName, lastName, oldpassword, newpassword } = req.body;
    const file = req.file;
    const updateData = {};

    // ✅ Name compare
    if (firstName && firstName !== user.fullName.firstName) {
      updateData['fullName.firstName'] = firstName;
    }
    if (lastName && lastName !== user.fullName.lastName) {
      updateData['fullName.lastName'] = lastName;
    }

    // ✅ Password compare
    if (newpassword) {
      if (!oldpassword) {
        return res.status(400).json({ message: "Old password is required" });
      }
      const isValid = await bcrypt.compare(oldpassword, user.password);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid Old Password" });
      }

      const isSamePassword = await bcrypt.compare(newpassword, user.password);
      if (!isSamePassword) {
        updateData.password = await bcrypt.hash(newpassword, 10);
      }
    }

    // ✅ Image compare using hash
    if (file) {
      const newFileHash = crypto.createHash("md5").update(file.buffer).digest("hex");
      const oldFileHash = user.imgHash || null;

      // Agar hash same hai to upload mat karo
      if (newFileHash !== oldFileHash) {
        const fileData = await uploadImg(file);
        updateData.imgUrl = fileData.url;
        updateData.imgHash = newFileHash; // 👈 yahi jaruri step tha
        updateData.imgFileId = fileData.fileId;
      }
    }



    // ✅ Agar kuch bhi change nahi hua
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No changes provided" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json({
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
    res.status(500).json({ message: "Internal server error" });
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