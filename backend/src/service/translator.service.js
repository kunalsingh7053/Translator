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

// Fallback dictionary for common short words
const fallbackDict = {
  "hello": "नमस्ते",
  "hi": "नमस्ते",
  "good morning": "सुप्रभात",
  "good night": "शुभ रात्रि",
  "thank you": "धन्यवाद",
  "yes": "हाँ",
  "no": "नहीं",
  "please": "कृपया",
};

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


async function translateText(text, targetLang, sourceLang = "English") {
  try {
    if (!text) throw new Error("Text is required");

    // Check fallback dictionary first
    const fallbackKey = text.trim().toLowerCase();
    if (fallbackDict[fallbackKey] && (targetLang === "Hindi")) {
      return fallbackDict[fallbackKey];
    }

    // Use language map defaults
    sourceLang = langMap[sourceLang] || "English";
    targetLang = langMap[targetLang] || "Hindi";

    // Strong prompt for GPT translation
const prompt = `
Translate the following text from ${sourceLang} to ${targetLang}.
Always translate every word except proper nouns.
Do not include explanations, quotes, or transliterations.
Respond ONLY with the translated text.
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
    return text; // fallback in case of error
  }
}

module.exports = translateText;
