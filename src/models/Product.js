const mongoose=require('mongoose')
const { v4: uuidv4 } = require('uuid');

const ReviewSchema= new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'USER',
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
    },
    { timestamps: true }
)

const ProductSchema= new mongoose.Schema({
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
            type: [ReviewSchema],
            required: false
        },
        rating: {
            type: Number,
            required: true,
            default: 0
        }
    },
    { timestamps: true }
)

ProductSchema.virtual("productId").get(function () {
    return this._id.toString();
});

ProductSchema.set("toJSON", { virtuals: true });
ProductSchema.set("toObject", { virtuals: true });


module.exports=mongoose.model('Product',ProductSchema);