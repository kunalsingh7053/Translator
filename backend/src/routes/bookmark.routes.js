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

module.exports = router;