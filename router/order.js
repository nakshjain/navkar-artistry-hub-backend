const express=require('express')
const router=express.Router()
const auth=require('../middleware/auth')
const {getAllOrders, createPaymentOrder, validatePayment, verifyOrderId} = require("../controllers/orderController");

router.get('/getAllOrders', auth, getAllOrders)

router.post('/createPaymentOrder', auth, createPaymentOrder)

router.post('/validatePayment', auth, validatePayment)

router.post('/verifyOrderId', auth, verifyOrderId)

module.exports=router