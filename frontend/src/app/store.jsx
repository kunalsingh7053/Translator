import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/reducers/userSlice";
import msgReducer from "../features/reducers/msgSlice";

export const store = configureStore({
  reducer: {
    userReducer: userSlice,
    msg: msgReducer,
  },
});