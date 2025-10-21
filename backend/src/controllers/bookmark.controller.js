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
       const {messageId,folderId,fileId} = req.body; 

       //1.Message Check 
       const message = await msgModel.findById(messageId);
       if(!message) 
       {
            return res.status(404).json({message:"Message Not Found"})
       }

         //2.Folder and File Check
         const folder = await chatfolderModel.findOne({_id:folderId,user:userId});
         if(!folder)
         { 
            return res.status(404).json({message:"Folder Not Found"})
         }
         const file = await chatfileModel.findOne({_id:fileId,user:userId,chatfolder:folderId});
         if(!file)
         {
            return res.status(404).json({message:"File Not Found"})
         }

      //3.Create Bookmark
      const newBookmark = await bookmarkModel.create({
         user:userId,
         msg:messageId,
         folder:folder._id, 
         file:file._id,
      })
      return res.status(201).json({message:"Bookmark Created Successfully",bookmark:newBookmark})


    } catch (error) {
      console.error("Error in addBookmark:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  
 
 }

 async function createFolder(req,res)
 { 
     const user = req.user._id;
     const {folderName} = req.body;
     if(!user) 
     { 
        return res.status(401).json({message:"Unauthorized"})
     }
     const newFolder = await chatfolderModel.create({
        user:user,
        title:folderName,
     })
     return res.status(201).json({message:"Folder Created Successfully",folder:newFolder})

 }
async function createFile(req, res) {
  const user = req.user._id;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { folderId, fileName } = req.body;
  const folder = await chatfolderModel.findOne({ _id: folderId, user: user });
  if (!folder) {
    return res.status(404).json({ message: "Folder Not Found" });
  }

  const newFile = await chatfileModel.create({
    user: user,
    chatfolder: folderId,   // 👈 correct field
    title: fileName,
  });

  return res.status(201).json({ message: "File Created Successfully", file: newFile });
}

 module.exports = {
    addBookmark,
    createFolder,
    createFile
 } 