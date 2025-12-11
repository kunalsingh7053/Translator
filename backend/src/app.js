const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

const authRoutes = require("./routes/auth.routes");
const translatorRoutes = require("./routes/chat.routes");
const bookmarkRoutes = require("./routes/bookmark.routes");

const app = express();

// ⬇⬇ ADD THIS
const passport = require("passport");
require("./service/googleAuth.service");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://fasttranslator.netlify.app","http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/translator", translatorRoutes);
app.use("/api", bookmarkRoutes);


const __dirname1 = path.resolve();
app.use(express.static(path.join(__dirname1, "../frontend/dist")));
// Serve React only for non-API routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname1, "../frontend/dist/index.html"));
});



module.exports = app;
