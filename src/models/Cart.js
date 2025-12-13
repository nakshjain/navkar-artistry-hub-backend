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
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Products'
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