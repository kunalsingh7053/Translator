import API from "../../api/axios";
import {
  addMessage,
  clearMessages as clearMsg,
  removeMessage as removeMsg, 
} from "../reducers/msgSlice";

// ✅ Translate Text via backend API
export const translateText = (inputText, sourceLang, targetLang) => async (dispatch) => {
  try {
    console.log("🔹 Translating:", { inputText, sourceLang, targetLang });

    const res = await API.post("/translator/chat", {
      title: inputText,
      sourceLang,
      targetLang,
    });
    console.log("response=>",res)
const translatedText = res.data.translatedText


    console.log("✅ Translated Text:", translatedText);

    dispatch(addMessage({ input: inputText, output: translatedText }));
    return { success: true, translatedText };
  } catch (error) {
    console.error("❌ Translation Error:", error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

// ✅ Clear all chat messages
export const clearAllMessages = () => (dispatch) => {
  dispatch(clearMsg());
  return { success: true };
};

// ✅ Remove single message
export const deleteMessage = (id) => (dispatch) => {
  dispatch(removeMsg(id)); 
  return { success: true };
};

