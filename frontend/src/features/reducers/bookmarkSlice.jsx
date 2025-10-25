import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  folders: [],
  files: [],
  bookmarks: [],
  loading: false,
  error: null
};

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: { 
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setFolders: (state, action) => {
      state.folders = action.payload;
    },
    addFolder: (state, action) => {
      state.folders.push(action.payload);
    },
    setFiles: (state, action) => {
      state.files = action.payload;
    },
    addFile: (state, action) => {
      state.files.push(action.payload);
    },
    setBookmarks: (state, action) => {
      state.bookmarks = action.payload;
    },
    addBookmark: (state, action) => {
      state.bookmarks.push(action.payload);
    }
  }
});

export const {
  setLoading,
  setError,
  setFolders,
  addFolder,
  setFiles,
  addFile,
  setBookmarks,
  addBookmark
} = bookmarkSlice.actions;

export default bookmarkSlice.reducer;