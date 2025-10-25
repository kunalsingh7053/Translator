const express = require("express");
const app = express();
const cookieparser = require("cookie-parser")
const cors = require("cors")
const authRoutes = require("./routes/auth.routes")
const translatorRoutes = require("./routes/chat.routes"); // ✅ correct
const bookmarkRoutes = require("./routes/bookmark.routes")
//using middlewares

app.use(express.json())
// Ye middleware req.cookies ko populate karega 
app.use(cookieparser());
const allowedOrigins = [
  "http://localhost:5173",          // dev
  "https://translator-1-sa98.onrender.com"  // production
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman) or if origin is in allowed list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true, // allow cookies
}));


//using routes
app.use("/api/auth",authRoutes)
app.use("/api/translator",translatorRoutes)
app.use("/api",bookmarkRoutes)


module.exports = app;
