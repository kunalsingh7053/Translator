const express = require("express");
const app = express();
const cookieparser = require("cookie-parser")
const cors = require("cors")
const path = require("path");

const authRoutes = require("./routes/auth.routes")
const translatorRoutes = require("./routes/chat.routes"); 
const bookmarkRoutes = require("./routes/bookmark.routes")

// 1️⃣ Middleware
app.use(express.json())
app.use(cookieparser())

const allowedOrigins = [
  "http://localhost:5173",
  "https://translator-1-sa98.onrender.com"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
}));

// 2️⃣ API Routes
app.use("/api/auth", authRoutes)
app.use("/api/translator", translatorRoutes)
app.use("/api", bookmarkRoutes)

// 3️⃣ Serve frontend for React
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// 4️⃣ Catch-all for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

module.exports = app;
