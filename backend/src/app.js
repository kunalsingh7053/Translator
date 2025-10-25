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
app.use(cors({
    origin: "https://translator-1-sa98.onrender.com",
    credentials: true,
}))

//using routes
app.use("/api/auth",authRoutes)
app.use("/api/translator",translatorRoutes)
app.use("/api",bookmarkRoutes)


module.exports = app;
