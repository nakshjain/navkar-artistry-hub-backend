const express=require('express')
const router=express.Router()
const auth=require('../middleware/auth')
const {getWishlist, addToWishlist}=require('../controllers/wishlistController')

router.get('/getWishlist', auth, getWishlist)

router.post('/addToWishlist', auth, addToWishlist)

// router.post('/removeFromWishlist', auth, removeFromWishlist)

module.exports=router