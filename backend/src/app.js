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

app.use(
  cors({
    origin: ["https://translator-1-sa98.onrender.com", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// ------------------ 2️⃣ API Routes ------------------
app.use("/api/auth", authRoutes);
app.use("/api/translator", translatorRoutes);
app.use("/api", bookmarkRoutes);

// ------------------ 3️⃣ Serve Frontend ------------------
const __dirname1 = path.resolve(); // root of project
app.use(express.static(path.join(__dirname1, "frontend", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname1, "frontend", "dist", "index.html"));
});

module.exports = app;
