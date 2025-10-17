const express = require("express");
const app = express();
const authRoutes = require("./routes/auth.routes")

//using middlewares

app.use(express.json())


//using routes
app.use("/api/auth",authRoutes)


module.exports = app;
