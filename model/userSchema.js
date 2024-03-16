const mongoose=require('mongoose')

const Schema= mongoose.Schema

const userSchema= new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type:[String],
        enum:["user","admin","super_admin"],
        default:["user"]
    }
})

const User=mongoose.model('USER',userSchema)
module.exports=User;