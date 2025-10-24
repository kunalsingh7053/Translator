// backend/src/routes/chat.routes.js
const express = require("express");
const { translateChat,chatHistory,deleteChat,clearAllChat } = require("../controllers/chat.controller");

const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware")

// POST /api/translator/chat
router.post("/chat",authMiddleware.authUser ,translateChat);
router.get("/history",authMiddleware.authUser,chatHistory)
// DELETE /api/translator/history/:id
router.delete("/history/:id", authMiddleware.authUser, deleteChat);
router.delete("/history", authMiddleware.authUser, clearAllChat);


module.exports = router;
 