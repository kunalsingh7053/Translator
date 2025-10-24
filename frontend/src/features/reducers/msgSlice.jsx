// src/features/reducers/msgSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [] // each message: { id, input, output, createdAt }
};

const msgSlice = createSlice({ 
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push({
        id: Date.now(),
        input: action.payload.input,
        output: action.payload.output,
        createdAt: new Date().toISOString(),
      });
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(
        (msg) => msg.id !== action.payload.id
      );
      
    },
  },
});

export const { addMessage, clearMessages, removeMessage } = msgSlice.actions;
export default msgSlice.reducer;
