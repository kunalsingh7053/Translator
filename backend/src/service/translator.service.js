const userModel = require("../models/user.model"); // adjust path
const axios = require("axios");

// Full name to code mapping
const langMap = {
  English: "en",
  Hindi: "hi",
  Spanish: "es",
  French: "fr",
  German: "de",
  // add more if needed
};

async function translateText( text, targetLang, sourceLang = "English") {
  try {
    if (!text) throw new Error("Text is required");

    // convert full name to code
    sourceLang = langMap[sourceLang] || "en";
    targetLang = langMap[targetLang] || "hi";

    const url = `https://lingva.ml/api/v1/${sourceLang}/${targetLang}/${encodeURIComponent(text)}`;

    const response = await axios.get(url);

    if (response.data && response.data.translation) {
      return response.data.translation;
    } else {
      throw new Error("Translation failed (No response from API)");
    }
  } catch (error) {
    console.error("Error translating text:", error.message);
    return null;
  }
}

module.exports = translateText;
