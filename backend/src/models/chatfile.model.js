const mongoose = require('mongoose');

const chatfileSchema = new mongoose.Schema({

  user:{
         type: mongoose.Schema.Types.ObjectId,
         ref:"user",
         required:true
     },
      title:{
        type:String,
        required:true
    },
    chatfolder:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"chatfolder",
        required:true
    }


},{
    timestamps:true
})
const chatfileModel = mongoose.model("chatfile",chatfileSchema);
module.exports = chatfileModel;