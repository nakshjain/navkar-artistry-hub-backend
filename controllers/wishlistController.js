const Product = require("../model/productSchema");
const User = require("../model/userSchema");
const Wishlist = require("../model/wishlistSchema");

const getWishlist=async (req, res)=>{
    try{
        const user=await User.findById(req.user._id)
        const email=user.toObject().email
        let wishlist=await Wishlist.findOne({email:email})
        let productsInWishlist=[]
        if(wishlist){
            productsInWishlist=await Product.find({productId: {$in: wishlist.wishlist}}).select('-_id -__v')
        } else {
            wishlist=new Wishlist({
                email: email,
                wishlist:[productId]
            })
        }
        await wishlist.save()
        res.status(200).json({
            error: false,
            message:'Wishlist fetched successfully',
            wishlist: productsInWishlist
        })
    } catch (error){
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const addToWishlist=async (req,res)=>{
    try{
        const {productId}=req.body
        const user=await User.findById(req.user._id)
        const email=user.toObject().email

        let wishlist=await Wishlist.findOne({email: email})
        if(wishlist){
            const existingIndex=wishlist.wishlist.findIndex((id)=>id===productId)
            if(existingIndex===-1){
                wishlist.wishlist.push(productId)
            }
        } else{
            wishlist=new Wishlist({
                email: email,
                wishlist:[productId]
            })
        }
        await wishlist.save()
        res.status(200).json({error:false, message:'Added to Wishlist Successfully'})
    } catch(error){
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const removeFromWishlist=async (req, res)=>{
    try{
        const {productId}=req.body
        const user=await User.findById(req.user._id)
        const email=user.toObject().email

        let wishlist=await Wishlist.findOne({email: email})
        if(wishlist){
            const existingIndex=wishlist.wishlist.findIndex((id)=> id===productId)
            if(existingIndex!==-1){
                wishlist.wishlist.splice(existingIndex,1)
            }
        }
        await wishlist.save()
        res.status(201).json({error:false, message:'Removed from Wishlist Successfully'})
    }catch (error){
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports={
    getWishlist,
    addToWishlist,
    removeFromWishlist
}