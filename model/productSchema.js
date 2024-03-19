const mongoose=require('mongoose')
const { v4: uuidv4 } = require('uuid');

const productSchema= new mongoose.Schema({
    productId: {
        type: String,
        default: uuidv4,
        unique: false
    },
    name:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    subCategory:{
        type: String,
        required: true
    },
    imageLink:{
        type: String,
        required: true
    },
    availability:{
        type: Boolean,
        required: true
    },
    quantity:{
      type: Number,
      required:true
    },
    price:{
        type: Number,
        required: true
    },
    about:{
        type: String,
        required:false
    }
})

const Product=mongoose.model('Product',productSchema)
module.exports=Product;