// backend/src/app.js
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

// Routes
const authRoutes = require("./routes/auth.routes");
const translatorRoutes = require("./routes/chat.routes");
const bookmarkRoutes = require("./routes/bookmark.routes");

const app = express();

// ------------------ 1️⃣ Middleware ------------------
app.use(express.json());
app.use(cookieParser());

// CORS setup
const allowedOrigins = [
  "http://localhost:5173",                       // dev
  "https://translator-1-sa98.onrender.com"       // production
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true, // allow cookies
}));

// ------------------ 2️⃣ API Routes ------------------
app.use("/api/auth", authRoutes);
app.use("/api/translator", translatorRoutes);
app.use("/api", bookmarkRoutes);

// ------------------ 3️⃣ Serve React Frontend ------------------
const frontendDistPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDistPath));

// ------------------ 4️⃣ Catch-all for React Router ------------------
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

module.exports = app;
