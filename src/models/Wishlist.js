const mongoose=require('mongoose')

const Schema=mongoose.Schema

const WishlistSchema= new Schema({
        userId: {
            type: String,
            unique: true,
            required:true
        },
        wishlist:{
            type:[mongoose.Schema.Types.ObjectId],
            required: true
        }
    },
    { timestamps: true }
)

module.exports=mongoose.model('Wishlist', WishlistSchema)