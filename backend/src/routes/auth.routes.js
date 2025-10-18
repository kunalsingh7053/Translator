const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post("/register",authController.register)
router.post("/login",authController.login)
router.post("/logout",authController.logout)

router.get("/profile",authMiddleware.authUser,authController.getProfile)
router.delete("/profile",authMiddleware.authUser,authController.deleteProfile)
router.patch(
  "/profile/update",
  authMiddleware.authUser,
  upload.single("image"), // Multer middleware to handle profile image
  authController.updateProfile
);


module.exports = router;  