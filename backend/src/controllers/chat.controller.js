 const userModel = require("../models/user.model")
const bookmarkModel = require("../models/bookmark.model")
const  msgModel = require("../models/msg.model")
const chatfileModel = require("../models/chatfile.model")
const chatfolderModel = require("../models/chatfolder.model")
const translateText = require("../service/translator.service")

async function startNewChat(req, res) {
    const userId = req.user._id;
    const { title, targetLang, sourceLang } = req.body;

    if (!title) return res.status(400).json({ message: "Text is required" });

    try {
        // Get user from DB to get default language
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Use user's default language if targetLang not provided
        const finalTargetLang = targetLang || user.language;
        const finalSourceLang = sourceLang || "en";

        // Translate
        const translatedText = await translateText(userId, title, finalTargetLang, finalSourceLang);

        // Save message to DB
        const newMsg = await msgModel.create({
            user: userId,
            originalText: title,
            translatedText,
            sourceLang: finalSourceLang,
            targetLang: finalTargetLang
        });

        res.status(200).json({ message: "Message saved", msg: newMsg });
    } catch (err) {
        console.error("Error starting new chat:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
module.exports = {
    startNewChat
}