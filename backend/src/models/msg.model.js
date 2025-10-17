const mongoose = require('mongoose');


const msgSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
   
   
     // 📝 Original text (jo user ne input diya)
  originalText: {
    type: String,
    required: true
  },
  // 🌐 Translated text (jo system ne output diya)
  translatedText: {
    type: String,
    required: true
  },
    // 📌 Source language (e.g. 'en')
  sourceLang: {
    type: String,
    required: true
  },

  // 📌 Target language (e.g. 'hi')
  targetLang: {
    type: String,
    required: true
  },
    // ⭐ Agar user bookmark kare msg ko
  isBookmarked: {
    type: Boolean,
    default: false
  }


},{
    timestamps:true
})
const msgModel = mongoose.model("msg",msgSchema);
module.exports = msgModel;