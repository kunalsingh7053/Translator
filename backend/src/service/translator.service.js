const { Configuration, OpenAIApi } = require("openai");

const langMap = {
  English: "English",
  Hindi: "Hindi",
  Spanish: "Spanish",
  French: "French",
  German: "German",
  // add more if needed 
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // ⚠️ Set in Render Environment
});

const openai = new OpenAIApi(configuration);

async function translateText(text, targetLang, sourceLang = "English") {
  try {
    if (!text) throw new Error("Text is required");

    sourceLang = langMap[sourceLang] || "English";
    targetLang = langMap[targetLang] || "Hindi";

    const prompt = `Translate the following text from ${sourceLang} to ${targetLang}:\n\n"${text}"`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const translation = completion.data.choices[0].message.content.trim();
    return translation;
  } catch (error) {
    console.error("Translation error:", error.message);
    // fallback: return original text
    return text;
  }
}

module.exports = translateText;
