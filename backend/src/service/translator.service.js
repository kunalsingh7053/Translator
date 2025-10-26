const axios = require("axios");

/**
 * Translate text using LibreTranslate (free API)
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code, e.g., "hi"
 * @param {string} sourceLang - Source language code, e.g., "en"
 * @returns {string} Translated text
 */
async function translateText(text, targetLang = "hi", sourceLang = "en") {
  try {
  const response = await axios.post(
  "https://libretranslate.de/translate", // more stable public instance
  {
    q: text,
    source: sourceLang,
    target: targetLang,
    format: "text"
  },
  { headers: { "Content-Type": "application/json" } }
);


    return response.data.translatedText;
  } catch (err) {
    console.error("Translation error:", err.message);
    return text; // fallback: return original text if API fails
  }
}

module.exports = translateText;
