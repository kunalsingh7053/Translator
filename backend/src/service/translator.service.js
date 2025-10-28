const axios = require("axios");

// Language map
const langMap = {
  English: "en", Hindi: "hi", Spanish: "es", French: "fr", German: "de",
  Portuguese: "pt", Italian: "it", Chinese: "zh", Japanese: "ja",
  Korean: "ko", Russian: "ru", Arabic: "ar", Turkish: "tr"
};

// API endpoints with fallback
const APIS = [
  {
    name: "LingvaTranslate",
    translate: async (text, sourceCode, targetCode) => {
      const url = `https://lingva.ml/api/v1/${sourceCode}/${targetCode}/${encodeURIComponent(text)}`;
      const res = await axios.get(url, { timeout: 8000 });
      return res.data.translation;
    }
  },
  {
    name: "LibreTranslate",
    translate: async (text, sourceCode, targetCode) => {
      const res = await axios.post("https://libretranslate.de/translate", {
        q: text,
        source: sourceCode,
        target: targetCode,
        format: "text"
      }, { timeout: 8000 });
      return res.data.translatedText;
    }
  },
  {
    name: "MyMemory",
    translate: async (text, sourceCode, targetCode) => {
      const res = await axios.get("https://api.mymemory.translated.net/get", {
        params: { q: text, langpair: `${sourceCode}|${targetCode}` },
        timeout: 8000
      });
      return res.data.responseData.translatedText;
    }
  }
];

// Optional: Pre-processing for better translations
function preprocessText(text) {
  return text.replace(/\s+/g, " ").trim();
}

// Optional: Post-processing cleanup
function postprocessText(text) {
  return text.replace(/^"|"$/g, "").trim();
}

// Master translator
async function translateText(text, targetLang = "Hindi", sourceLang = "English") {
  const targetCode = langMap[targetLang] || targetLang.toLowerCase();
  const sourceCode = langMap[sourceLang] || sourceLang.toLowerCase();

  if (targetCode === sourceCode) return text;

  const cleanText = preprocessText(text);
  console.log(`Translating "${cleanText}" from ${sourceLang} ➜ ${targetLang}`);

  for (let api of APIS) {
    try {
      console.log(`🔄 Trying ${api.name}...`);
      const translated = await api.translate(cleanText, sourceCode, targetCode);
      if (translated && translated.trim()) {
        console.log(`✅ Success with ${api.name}`);
        return postprocessText(translated);
      }
    } catch (err) {
      console.log(`❌ ${api.name} failed: ${err.message}`);
    }
  }

  throw new Error("All translation APIs failed");
}

module.exports = translateText;
