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
        default:"https://i.pinimg.com/736x/33/55/9a/33559a518b7eda89429411a7dc59a6b0.jpg"
    }
},
{
    timestamps:true
}
)
const userModel = mongoose.model('user',userSchema);

module.exports = userModel;