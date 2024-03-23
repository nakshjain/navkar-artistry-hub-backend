const mongoose=require('mongoose')

const Schema=mongoose.Schema

const wishlistSchema= new Schema({
    email:{
        type:String,
        required: true
    },
    wishlist:{
        type:[String],
        required: true
    }
})

const Wishlist= mongoose.model('Wishlist', wishlistSchema)

module.exports=Wishlist