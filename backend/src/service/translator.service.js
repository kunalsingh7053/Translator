const userModel = require("../models/user.model"); // adjust path

const axios = require('axios');

async function translateText(userId, text, targetLang, sourceLang = "en") {
  try {
    // 1️⃣ Get user from DB
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");

    // 2️⃣ Use user's language as default if targetLang not provided
    targetLang = targetLang || user.language;

    // 3️⃣ Prepare API URL
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

    // 4️⃣ Call translation API
    const response = await axios.get(url);

    if (response.data && response.data.responseData) {
      return response.data.responseData.translatedText;
    } else {
      throw new Error("Translation failed");
    }
  } catch (error) {
    console.error("Error translating text:", error.message);
    return null;
  }
}

module.exports = translateText;