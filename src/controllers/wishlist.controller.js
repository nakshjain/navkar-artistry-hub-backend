const Product = require("../models/Product");
const User = require("../models/User");
const Wishlist = require("../models/Wishlist");

const getWishlist=async (req, res)=>{
    try{
        const user=await User.findById(req.user._id)
        const userId=user.toObject().userId
        let wishlist=await Wishlist.findOne({userId:userId})
        let productsInWishlist=[]
        if(wishlist){
            productsInWishlist=await Product.find({productId: {$in: wishlist.wishlist}}).select('-_id -__v')
        } else {
            wishlist=new Wishlist({
                userId: userId,
                wishlist:[]
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
        const userId=user.toObject().userId

        let wishlist=await Wishlist.findOne({userId: userId})
        if(wishlist){
            const existingIndex=wishlist.wishlist.findIndex((id)=>id===productId)
            if(existingIndex===-1){
                wishlist.wishlist.push(productId)
            }
        } else{
            wishlist=new Wishlist({
                userId: userId,
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
        const userId=user.toObject().userId

        let wishlist=await Wishlist.findOne({userId: userId})
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
const mergeWishlist=async (req,res)=>{
    try{
        const logoutWishList=req.body.wishlist
        const userId=req.body.userId
        let userWishlist=await Wishlist.findOne({userId: userId})
        if(!userWishlist){
            userWishlist= new Wishlist({
                userId,
                wishlist:[]
            })
        }
        if(logoutWishList){
            logoutWishList.forEach(
                (wishlistItem)=>{
                    const existingProductIndex=userWishlist.wishlist.findIndex(item=>item===wishlistItem.productId)
                    if(existingProductIndex === -1){
                        userWishlist.wishlist.push(wishlistItem.productId)
                    }
                }
            )
        }
        await userWishlist.save()
        res.status(201).json({ error:false, message: 'Wishlist Merged Successfully' })
    } catch (error){
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports={
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    mergeWishlist
}