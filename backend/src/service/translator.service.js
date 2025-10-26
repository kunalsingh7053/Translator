require("dotenv").config(); // Load environment variables
const OpenAI = require("openai");

// Language mapping
const langMap = {
  English: "English",
  Hindi: "Hindi",
  Spanish: "Spanish",
  French: "French",
  German: "German",
  // Add more languages if needed
};

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Translate text from sourceLang to targetLang
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language
 * @param {string} sourceLang - Source language (default English)
 * @returns {string} Translated text
 */
async function translateText(text, targetLang, sourceLang = "English") {
  try {
    if (!text) throw new Error("Text is required");

    sourceLang = langMap[sourceLang] || "English";
    targetLang = langMap[targetLang] || "Hindi";

    // Strong prompt to ensure accurate translation
    const prompt = `
Translate the following text from ${sourceLang} to ${targetLang}.
Respond ONLY with the translated text, without explanations or quotes.
Text: "${text}"
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a professional translator. Always translate accurately." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3 // deterministic translation
    });

    return completion.choices[0].message.content.trim();

  } catch (error) {
    console.error("Translation error:", error.message);
    return text; // fallback
  }
}

module.exports = translateText;
