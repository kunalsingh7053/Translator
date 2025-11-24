const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const passport = require("passport");

// -------------------------------------------
// 🔹 NORMAL AUTH ROUTES
// -------------------------------------------
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.get("/profile", authMiddleware.authUser, authController.getProfile);
router.delete("/profile", authMiddleware.authUser, authController.deleteProfile);

router.patch(
  "/profile/update",
  authMiddleware.authUser,
  upload.single("image"),
  authController.updateProfile
);

// -------------------------------------------
// 🔹 GOOGLE LOGIN ROUTES
// -------------------------------------------

// 🔥 Step 1 — Start Google OAuth (no session)
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,     // ⬅ REQUIRED
  })
);

// 🔥 Step 2 — Google redirect callback (no session)
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,     // ⬅ REQUIRED
  }),
  authController.googleAuthSuccess
);

module.exports = router;
