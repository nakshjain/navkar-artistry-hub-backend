const mongoose=require('mongoose')

const Schema= mongoose.Schema

const userOTPSchema= new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    OTP:{
        type: Number,
        required: true
    },
    validity:{
        type: Date,
        expires: 0,
        required:true
    }
})

userOTPSchema.index({ validity: 1 }, { expireAfterSeconds: 0 });

const OTP=mongoose.model('OTP',userOTPSchema)
module.exports=OTP;