const mongoose=require('mongoose')

const Schema=mongoose.Schema

const CartSchema= new Schema({
        userId: {
            type: String,
            unique: true,
            required:true
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
    },
    { timestamps: true }
)

module.exports=mongoose.model('Cart', CartSchema)