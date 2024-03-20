const express=require('express')
const router=express.Router()
const auth=require('../middleware/auth')
const {getCart, addToCart, removeFromCart, mergeCart}=require('../controllers/cartController')

router.get('/getCart', auth, getCart)

router.post('/addToCart', auth, addToCart)

router.post('/removeFromCart', auth, removeFromCart)

router.post('/mergeCart', mergeCart)

module.exports=router