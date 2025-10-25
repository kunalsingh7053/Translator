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

async function translateText(text, targetLang, sourceLang = "English") {
  try {
    if (!text) throw new Error("Text is required");

    sourceLang = langMap[sourceLang] || "en";
    targetLang = langMap[targetLang] || "hi";

    const url = `https://lingva.ml/api/v1/${sourceLang}/${targetLang}/${encodeURIComponent(text)}`;
    console.log("Translation API URL:", url);

    const response = await axios.get(url).catch(err => {
      console.error("Lingva API call failed:", err.message);
      return null;
    });

    console.log("Lingva API response:", response?.data);

    if (response && response.data && response.data.translation) {
      return response.data.translation;
    } else {
      console.warn("Translation failed, returning fallback text");
      return "[translation failed]";
    }
  } catch (error) {
    console.error("Error translating text:", error.message);
    return "[translation failed]";
  }
}


module.exports = translateText;
