import API from "../../api/axios";
import { setLoading, setError, addFolder, addFile, addBookmark, setFolders, setFiles, setBookmarks } from "../reducers/bookmarkSlice";

// Create a new folder
export const createFolder = (folderName) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await API.post("/foldercreate", { folderName });
    dispatch(addFolder(response.data.folder));
    dispatch(setLoading(false));
    return response.data;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to create folder"));
    throw error;
  }
};

// Create a new file in a folder
export const createFile = (folderId, fileName) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await API.post("/filecreate", { folderId, fileName });
    dispatch(addFile(response.data.file));
    dispatch(setLoading(false));
    return response.data;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to create file"));
    throw error; 
  }
};

// Add a bookmark
export const addBookmarkToFile = (messageId, folderId, fileId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await API.post("/bookmark", { messageId, folderId, fileId },{
        withCredentials:true
    });
    dispatch(addBookmark(response.data.bookmark));
    dispatch(setLoading(false));
    return response.data;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to add bookmark"));
    throw error;
  }
};

// Fetch user's folders
export const fetchFolders = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await API.get("/folders");
    dispatch(setFolders(response.data.folders));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to fetch folders"));
  }
};

// Fetch files in a folder
export const fetchFiles = (folderId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await API.get(`/files/${folderId}`); 
    dispatch(setFiles(response.data.files));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to fetch files"));
  }
};

// Fetch bookmarks in a file
export const fetchBookmarks = (fileId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await API.get(`/bookmarks/${fileId}`);
    dispatch(setBookmarks(response.data.bookmarks));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Failed to fetch bookmarks"));
  }
};