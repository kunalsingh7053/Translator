 const express = require('express');
 const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware")
const bookmarkController = require("../controllers/bookmark.controller")
router.post('/bookmark',authMiddleware.authUser, bookmarkController.addBookmark);
router.post('/foldercreate',authMiddleware.authUser, bookmarkController.createFolder);
router.post('/filercreate',authMiddleware.authUser, bookmarkController.createFile);
    module.exports = router;