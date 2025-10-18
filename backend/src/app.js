const express = require("express");
const app = express();
const cookieparser = require("cookie-parser")
const cors = require("cors")
const authRoutes = require("./routes/auth.routes")
//using middlewares

app.use(express.json())
// Ye middleware req.cookies ko populate karega
app.use(cookieparser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

//using routes
app.use("/api/auth",authRoutes)


module.exports = app;
