const axios = require("axios");

const langMap = {
    English: "en", Hindi: "hi", Spanish: "es", French: "fr", German: "de",
    Portuguese: "pt", Italian: "it", Chinese: "zh", Japanese: "ja",
    Korean: "ko", Russian: "ru", Arabic: "ar", Turkish: "tr"
};

// Multiple API endpoints with priority
const APIS = [
    {
        name: "LibreTranslate",
        translate: async (text, sourceCode, targetCode) => {
            const response = await axios.post("https://libretranslate.de/translate", {
                q: text, source: sourceCode, target: targetCode, format: "text"
            }, { timeout: 10000 });
            return response.data.translatedText;
        }
    },
    {
        name: "MyMemory",
        translate: async (text, sourceCode, targetCode) => {
            const response = await axios.get("https://api.mymemory.translated.net/get", {
                params: { q: text, langpair: `${sourceCode}|${targetCode}` },
                timeout: 8000
            });
            return response.data.responseData.translatedText;
        }
    },
    {
        name: "ArgosTranslate",
        translate: async (text, sourceCode, targetCode) => {
            const response = await axios.post("https://translate.argosopentech.com/translate", {
                q: text, source: sourceCode, target: targetCode, format: "text"
            }, { timeout: 10000 });
            return response.data.translatedText;
        }
    }
];

// Text preprocessing for better translation quality
function preprocessText(text) {
    let processed = text;
    
    // Remove extra spaces and normalize text
    processed = processed.replace(/\s+/g, ' ').trim();
    
    // Add proper punctuation if missing
    if (!/[.!?]$/.test(processed)) {
        processed += '.';
    }
    
    // Fix common spelling mistakes for better translation
    const commonCorrections = {
        "boat up": "brought up",
        "handof": "hands-on",
        "expreince": "experience",
        "tookit": "toolkit",
        "managment": "management",
        "mongo db": "mongodb",
        "nodejs": "node.js",
        "express js": "express.js",
        "react js": "react.js"
    };
    
    Object.keys(commonCorrections).forEach(wrong => {
        const correct = commonCorrections[wrong];
        processed = processed.replace(new RegExp(wrong, 'gi'), correct);
    });
    
    return `"${processed}"`; // Wrap in double quotes for better context
}

// Text post-processing for cleaner output
function postprocessText(text) {
    let processed = text;
    
    // Remove extra quotes if API added them
    processed = processed.replace(/^"|"$/g, '');
    
    // Fix common translation errors in Hindi
    const hindiCorrections = {
        "नाव चलाता": "पालन-पोषण",
        "हैंडऑफ": "व्यावहारिक",
        "एक्सपेंस": "अनुभव",
        "टेकिट": "टूलकिट",
        "मोंगो डीबी": "MongoDB",
        "नोडजेज": "Node.js",
        "एक्सप्रेस जेएस": "Express.js",
        "रिएक्ट जेएस": "React.js",
        "रेडक्स": "Redux",
        "मैनेजमेंट": "प्रबंधन"
    };
    
    Object.keys(hindiCorrections).forEach(wrong => {
        const correct = hindiCorrections[wrong];
        processed = processed.replace(new RegExp(wrong, 'g'), correct);
    });
    
    return processed.trim();
}

async function translateText(text, targetLang = "Hindi", sourceLang = "English") {
    try {
        const targetCode = langMap[targetLang] || targetLang.toLowerCase();
        const sourceCode = langMap[sourceLang] || sourceLang.toLowerCase();

        if (targetCode === sourceCode) return text;

        // Preprocess text - wrap in quotes and fix common errors
        const processedText = preprocessText(text);
        console.log(`🔄 Processed input: ${processedText}`);

        // Try all APIs in order until one works
        for (let api of APIS) {
            try {
                console.log(`Trying ${api.name}...`);
                const result = await api.translate(processedText, sourceCode, targetCode);
                
                if (result && result.trim() !== "" && result !== processedText) {
                    console.log(`✅ Success with ${api.name}`);
                    
                    // Post-process the result for cleaner output
                    const finalResult = postprocessText(result);
                    return finalResult;
                }
            } catch (error) {
                console.log(`❌ ${api.name} failed:`, error.message);
                continue;
            }
        }

        throw new Error("All translation APIs failed");

    } catch (error) {
        console.error("❌ All translation attempts failed:", error.message);
        return text;
    }
}

// =========================================================================
// ✅ SINGLE EXPORT: Only one function exported
// =========================================================================
module.exports = translateText;