const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const passport = require("passport");
const jwt = require("jsonwebtoken");

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

// 🔹 Google Login Start
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// 🔹 Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

  res.redirect(
      `${process.env.FRONTEND_URL}/auth/success?new=${isNewUser}`
    );
  }
);
module.exports = router;
