const axios = require("axios");

const langMap = {
  English: "en", Hindi: "hi", Spanish: "es", French: "fr", German: "de",
  Portuguese: "pt", Italian: "it", Chinese: "zh", Japanese: "ja",
  Korean: "ko", Russian: "ru", Arabic: "ar", Turkish: "tr"
};

// Free APIs in fallback order
const APIS = [
  {
    name: "Lingva (Google Mirror)",
    translate: async (text, sourceCode, targetCode) => {
      const url = `https://lingva.pot-app.com/api/v1/${sourceCode}/${targetCode}/${encodeURIComponent(text)}`;
      const res = await axios.get(url, { timeout: 8000 });
      return res.data.translation;
    }
  },
  {
    name: "GoogleTranslate Proxy",
    translate: async (text, sourceCode, targetCode) => {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceCode}&tl=${targetCode}&dt=t&q=${encodeURIComponent(text)}`;
      const res = await axios.get(url, { timeout: 8000 });
      if (Array.isArray(res.data)) {
        return res.data[0].map(item => item[0]).join("");
      }
      return null;
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
      }, { timeout: 10000 });
      return res.data.translatedText;
    }
  }
];

// Small cleanup for input
function preprocessText(text) {
  return text.replace(/\s+/g, " ").trim();
}

// Cleanup output
function postprocessText(text) {
  return text.replace(/^"|"$/g, "").trim();
}

async function translateText(text, targetLang = "Hindi", sourceLang = "English") {
  const targetCode = langMap[targetLang] || targetLang.toLowerCase();
  const sourceCode = langMap[sourceLang] || sourceLang.toLowerCase();

  if (targetCode === sourceCode) return text;

  const cleanText = preprocessText(text);
  console.log(`🌐 Translating "${cleanText}" from ${sourceLang} ➜ ${targetLang}`);

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

  console.error("❌ All APIs failed");
  return text;
}

module.exports = translateText;
