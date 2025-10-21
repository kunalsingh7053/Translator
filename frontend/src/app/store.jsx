import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/reducers/userSlice";
export const store = configureStore({
  reducer: {
    userReducer: userSlice,
  },
});