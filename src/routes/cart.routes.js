const express=require('express')
const router=express.Router()
const auth=require('../middleware/auth')
const {getCart, addToCart, removeFromCart, clearCart, mergeCart}=require('../controllers/cart.controller')

router.get('/getCart', auth, getCart)

router.post('/addToCart', auth, addToCart)

router.post('/removeFromCart', auth, removeFromCart)

router.delete('/clearCart', auth, clearCart)

router.post('/mergeCart', mergeCart)

module.exports=router