const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        }
    },
    password:{
        type:String,
    },
    imgUrl:{
        type:String,
        default:"https://ik.imagekit.io/ofm1vl6gr/translator/profilePics/673edd189b210fabf300c588345cc87b_nE4QNnH2x.jpg"
    },
    imgHash: { 
        type: String,
        default: "d4b2e8352a646bc92d78dc785e373903"
     },
    imgFileId:{
        type:String,
        default:"68f454be5c7cd75eb8eaaa44" 
    },
      language: {
        type: String,
        required: true
    }

},
{
    timestamps:true
}
)
const userModel = mongoose.model('user',userSchema);

module.exports = userModel;