const mongoose=require('mongoose')

const productSchema= new mongoose.Schema({
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