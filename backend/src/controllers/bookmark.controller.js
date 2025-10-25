const bookmarkModel = require("../models/bookmark.model")
const chatfileModel = require("../models/chatfile.model")
const chatfolderModel = require("../models/chatfolder.model")
const msgModel = require("../models/msg.model")

async function addBookmark(req, res) {
  try { 
    const userId = req.user._id;
    if(!userId) {
      return res.status(401).json({message:"Unauthorized"})
    }
    const {messageId,folderId,fileId} = req.body;  

    //1.Message Check 
    const message = await msgModel.findById(messageId);
    if(!message) {
      return res.status(404).json({message:"Message Not Found"})
    }

    //2.Folder and File Check
    const folder = await chatfolderModel.findOne({_id:folderId,user:userId});
    if(!folder) { 
      return res.status(404).json({message:"Folder Not Found"})
    }
    const file = await chatfileModel.findOne({_id:fileId,user:userId,chatfolder:folderId});
    if(!file) {
      return res.status(404).json({message:"File Not Found"})
    }

    //3.Create Bookmark
    const newBookmark = await bookmarkModel.create({
      user:userId,
      msg:messageId,
      folder:folder._id, 
      file:file._id,
    })

    // Populate the message details before sending response
    const populatedBookmark = await bookmarkModel.findById(newBookmark._id)
      .populate('msg')
      .populate('folder')
      .populate('file');

    return res.status(201).json({message:"Bookmark Created Successfully", bookmark:populatedBookmark})
  } catch (error) {
    console.error("Error in addBookmark:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function createFolder(req,res) { 
  try {
    const user = req.user._id;
    const {folderName} = req.body;
    if(!user) { 
      return res.status(401).json({message:"Unauthorized"})
    }
    const newFolder = await chatfolderModel.create({
      user:user,
      title:folderName,
    })
    return res.status(201).json({message:"Folder Created Successfully",folder:newFolder})
  } catch (error) {
    console.error("Error in createFolder:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function createFile(req, res) {
  try {
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
      chatfolder: folderId,
      title: fileName,
    });

    return res.status(201).json({ message: "File Created Successfully", file: newFile });
  } catch (error) {
    console.error("Error in createFile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getFolders(req, res) {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const folders = await chatfolderModel.find({ user: userId })
      .sort({ lastActivity: -1 });

    return res.status(200).json({ folders });
  } catch (error) {
    console.error("Error in getFolders:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getFiles(req, res) {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { folderId } = req.params;
    const files = await chatfileModel.find({ user: userId, chatfolder: folderId })
      .sort({ createdAt: -1 });

    return res.status(200).json({ files });
  } catch (error) {
    console.error("Error in getFiles:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getBookmarks(req, res) { 
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { fileId } = req.params;
    const bookmarks = await bookmarkModel.find({ user: userId, file: fileId })
      .populate('msg')
      .sort({ createdAt: -1 });

    return res.status(200).json({ bookmarks });
  } catch (error) {
    console.error("Error in getBookmarks:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteFolder(req, res) {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Correctly extract folderId
    const { folderId } = req.params;

    // ✅ Check if folder exists and belongs to user
    const folder = await chatfolderModel.findOne({ _id: folderId, user: userId });
    if (!folder) {
      return res.status(404).json({ message: "Folder Not Found" });
    }

    // ✅ Delete all files under this folder
    await chatfileModel.deleteMany({ chatfolder: folderId, user: userId });

    // ✅ Delete all bookmarks under those files (optional but recommended)
    await bookmarkModel.deleteMany({ folder: folderId, user: userId });

    // ✅ Finally delete the folder
    await chatfolderModel.deleteOne({ _id: folderId, user: userId });

    return res.status(200).json({
      message: "Folder, files, and bookmarks deleted successfully"
    });

  } catch (error) {
    console.error("Error in deleteFolder:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteFile(req,res){
  try {
        const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  const {fileId} = req.params;
  await chatfileModel.deleteOne({_id: fileId, user: userId})
      return res.status(200).json({ message: "File deleted successfully" });


  } catch (error) {
    
  }
}

module.exports = {
  addBookmark,
  createFolder,
  createFile,
  getFolders,
  getFiles,
  getBookmarks,
  deleteFolder,
  deleteFile
}