const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  msg: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "msg",
    required: true 
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chatfolder",
    required: true
  },
  file: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "chatfile", 
    required: true
  }
}, {
  timestamps: true
});

const bookmarkModel = mongoose.model("bookmark", bookmarkSchema);

module.exports = bookmarkModel;
