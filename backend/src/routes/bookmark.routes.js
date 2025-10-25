const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware")
const bookmarkController = require("../controllers/bookmark.controller")

// Creation endpoints
router.post('/bookmark', authMiddleware.authUser, bookmarkController.addBookmark);
router.post('/foldercreate', authMiddleware.authUser, bookmarkController.createFolder); 
router.post('/filecreate', authMiddleware.authUser, bookmarkController.createFile);

// Fetch endpoints
router.get('/folders', authMiddleware.authUser, bookmarkController.getFolders);
router.get('/files/:folderId', authMiddleware.authUser, bookmarkController.getFiles);
router.get('/bookmarks/:fileId', authMiddleware.authUser, bookmarkController.getBookmarks);


//delete endpoints
router.delete("/folderdelete/:folderId",authMiddleware.authUser,bookmarkController.deleteFolder)
router.delete("/filedelete/:fileId",authMiddleware.authUser,bookmarkController.deleteFile)
module.exports = router; 