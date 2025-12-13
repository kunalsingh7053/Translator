const express = require("express");
const app = express();
const cookieparser = require("cookie-parser")
const cors = require("cors")
const authRoutes = require("./routes/auth.routes")
const translatorRoutes = require("./routes/chat.routes"); // ✅ correct
const bookmarkRoutes = require("./routes/bookmark.routes")
const passport = require('passport');
require('./service/googleAuth.service'); // ✅ Load the Google strategy from here

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

//using routes
app.use("/api/auth",authRoutes)
app.use("/api/translator",translatorRoutes)
app.use("/api",bookmarkRoutes)


module.exports = app;
