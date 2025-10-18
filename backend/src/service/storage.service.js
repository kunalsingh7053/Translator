const Imagekit = require("imagekit");

const imagekit  = new Imagekit({
    publicKey:process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY, 
    urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT
});


 function uploadImg(img)
{
  return new Promise((resolve,reject)=>{
    imagekit.upload({
        file:img.buffer,
        fileName:img.originalname,
        folder:"translator/profilePics"

    },(error,result)=>{

        if(error){
            reject(error);
        }
        else{
            resolve(result);
        }
    })
  })
}

module.exports= uploadImg; 