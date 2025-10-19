 const bookmarkModel = require("../models/bookmark.model")
const chatfileModel = require("../models/chatfile.model")
const chatfolderModel = require("../models/chatfolder.model")
const msgModel = require("../models/msg.model")
 async function addBookmark(req, res) {
  
    
    try {
       
       const userId = req.user._id;
       if(!userId)
       {
          return res.status(401).json({message:"Unauthorized"})
       }
       const {messageId,folderName,fileName} = req.body;

       //1.Message Check
       const message = await msgModel.findById(messageId);
       if(!message)
       {
            return res.status(404).json({message:"Message Not Found"})
       }

         //2.Check Folder
         let folder = await chatfolderModel.findOne({user:userId,title:folderName});
         if(!folder)
         {
            
         }


    } catch (error) {
      
    }
  
 
 }

 async function createFolder(userId,folderName)

 {

 }
 async function createFile(userId,folderId,fileName)
 {

 }
 module.exports = {
    addBookmark,
    createFolder,
    createFile
 }