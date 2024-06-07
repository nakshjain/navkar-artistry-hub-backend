const mongoose=require('mongoose')
const { v4: uuidv4 } = require('uuid');

const reviewSchema= new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: true
    },
    writtenReview: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
    verifiedPurchase: {
        type: Boolean,
        required: true
    },
    helpfulVotes: {
        type: Number,
        required: false
    },
    votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: false
            },
            action: {
                type: String,
                enum: ['upvote', 'downvote'],
                required: false
            }
        }
    ]
})

const productSchema= new mongoose.Schema({
    productId: {
        type: String,
        default: uuidv4,
        unique: false
    },
    artistName:{
        type: String,
        required: true
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
    imageLinks:{
        type: [String],
        required: false
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
    },
    reviews:{
        type: [reviewSchema],
        required: false
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    }
})

const Product=mongoose.model('Product',productSchema)
module.exports=Product;