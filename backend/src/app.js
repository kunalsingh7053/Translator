const express = require("express");
const app = express();
const cookieparser = require("cookie-parser")
const cors = require("cors")
const authRoutes = require("./routes/auth.routes")
const translatorRoutes = require("./routes/chat.routes"); // ✅ correct
const bookmarkRoutes = require("./routes/bookmark.routes")
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

//using middlewares

app.use(express.json())
// Ye middleware req.cookies ko populate karega 
app.use(cookieparser());
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://fasttranslator.netlify.app"
    ],
    credentials: true,
}));


app.use(passport.initialize());

// Configure Passport to use Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Here, you would typically find or create a user in your database
  // For this example, we'll just return the profile
  return done(null, profile);
}));

// Route to initiate Google OAuth flow
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback route that Google will redirect to after authentication
app.get('/api/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // Generate a JWT for the authenticated user
    const token = jwt.sign({ id: req.user.id, displayName: req.user.displayName }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Send the token to the client
    res.json({ token });
  }
);
//using routes
app.use("/api/auth",authRoutes)
app.use("/api/translator",translatorRoutes)
app.use("/api",bookmarkRoutes)


module.exports = app;
