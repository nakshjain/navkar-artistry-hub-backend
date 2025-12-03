const mongoose=require('mongoose')

const Schema= mongoose.Schema

const UserOTPSchema= new Schema({
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
    },
    { timestamps: true }
)

UserOTPSchema.index({ validity: 1 }, { expireAfterSeconds: 0 });

module.exports=mongoose.model('OTP',UserOTPSchema)