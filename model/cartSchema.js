const mongoose=require('mongoose')
const Product=require('./productSchema')

const Schema=mongoose.Schema

const cartSchema= new Schema({
    email:{
        type:String,
        required: true
    },
    cart:[
        {
            product:{
                type:Product.schema,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }
    ]
})

const Cart= mongoose.model('Cart', cartSchema)

module.exports=Cart