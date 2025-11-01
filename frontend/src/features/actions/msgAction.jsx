import API from "../../api/axios";
import {
  addMessage,
  clearMessages as clearMsg,
  removeMessage as removeMsg, 
} from "../reducers/msgSlice";

// ✅ Translate Text via backend API
export const translateText = (inputText, sourceLang, targetLang) => async (dispatch) => {
  try {

    const res = await API.post("/translator/chat", {
      title: inputText,
      sourceLang,
      targetLang,
    });
    if (!res.data.success) {
      throw new Error(res.data.message || "Translation failed");
    }

    const translatedText = res.data.translatedText;
    const msg = res.data.msg;

    dispatch(addMessage({ 
      id: msg._id,
      input: msg.originalText, 
      output: translatedText,
      sourceLang: msg.sourceLang,
      targetLang: msg.targetLang
    }));
    return { success: true, translatedText, msg };
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

