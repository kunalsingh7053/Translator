const mongoose = require("mongoose");

async function connectDB() {
     
    try {
        
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to Mongo DB");
    } catch (error) {
        console.log("Error connecting to Mongo DB", error);
    }


}

module.exports = connectDB;