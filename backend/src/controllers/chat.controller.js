 const userModel = require("../models/user.model")
const bookmarkModel = require("../models/bookmark.model")
const  msgModel = require("../models/msg.model")
const chatfileModel = require("../models/chatfile.model")
const chatfolderModel = require("../models/chatfolder.model")
const translateText = require("../service/translator.service")
const mongoose = require("mongoose");


async function translateChat(req, res) {
  try {
    const { title, targetLang, sourceLang } = req.body;
    const userId = req.user?._id || null;

    console.log("📥 Incoming translateChat request:", {
      title,
      targetLang,
      sourceLang,
      userId,
    });
 
    if (!title) {
      return res.status(400).json({ success: false, message: "Text is required" });
    }

    // Trim inputs to remove extra spaces
    const translatedText = await translateText(
      userId,
      title.trim(),
      targetLang.trim(),
      sourceLang.trim()
    );

    console.log("📤 Translation result:", translatedText);

    if (!translatedText) {
      return res.status(500).json({
        success: false,
        message: "Translation failed (No response from API)",
      });
    } 
   
const msg = await msgModel.create({
  user: userId,
  originalText: title.trim(),
  translatedText,
  sourceLang: sourceLang.trim(),
  targetLang: targetLang.trim(),
});

    
    res.json({
      success: true,
      translatedText,
      msg: {
        _id: msg._id,
        originalText: msg.originalText,
        translatedText: msg.translatedText,
        sourceLang: msg.sourceLang,
        targetLang: msg.targetLang
      }
    });
  } catch (error) {
    console.error("💥 Error in translateChat:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

async function chatHistory(req,res)
{
  try {
    
    const userId = req.user?._id || null;
    if(!userId)
    {

      return res.status(401).json({ success: false, message: "Unauthorized access" })
    }
   const history = await msgModel
     .find({ user: userId })
     .sort({ createdAt: -1 }); // latest first
   res.json({ success: true, history });
  } catch (error) {
    console.error("💥 Error fetching history:", error);
    res.status(500).json({ success: false, message: error.message });
  }
     
}
// DELETE a specific chat message by ID
async function deleteChat(req, res) {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid message ID" });
    }

    const msg = await msgModel.findOne({ _id: id, user: userId });

    if (!msg) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

await msg.deleteOne();

    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("💥 Error deleting chat message:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

async function clearAllChat(req,res){

try {
  
  const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

        await msgModel.deleteMany({ user: userId }); // ✅ deletes all user's messages
       
        res.json({ success: true, message: "All chat history cleared successfully"})
} catch (error) {
  console.log("error in clear all chat", error)
      res.status(500).json({ success: false, message: error.message });

}
}

module.exports = {
    translateChat,
    chatHistory,
    deleteChat,
    clearAllChat
}