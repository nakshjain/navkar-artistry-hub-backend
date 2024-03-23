const mongoose=require('mongoose')

const Schema= mongoose.Schema

const addressSchema= new Schema({
    name:{
        type: String,
        required: true
    },
    contactNumber:{
        type: Number,
        required: true
    },
    streetAddress:{
        type: String,
        required: true
    },
    locality:{
        type: String,
        required: true
    },
    region:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    pinCode:{
        type: Number,
        required: true
    },
    additionInfo:{
        type: String,
        required:false
    }
})

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
    contactNumber:{
        type: Number,
        required: false
    },
    dob:{
        type: Date,
        required: false
    },
    role:{
        type:[String],
        enum:["user","admin","super_admin"],
        default:["user"]
    },
    addresses:{
        type:[addressSchema],
        required: false

    },
    defaultAddress: {
        type: String,
        required: false
    }
})

const User=mongoose.model('USER',userSchema)
module.exports=User;