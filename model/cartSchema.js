const mongoose=require('mongoose')

const Schema=mongoose.Schema

const cartSchema= new Schema({
    email:{
        type:String,
        required: true
    },
    cart:[
        {
            productId:{
                type:String,
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