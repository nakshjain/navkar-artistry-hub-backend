const express=require('express')
const router=express.Router()
const auth=require('../middleware/auth')
const {getAllOrders, getOrderDetails, createPaymentOrder, validatePayment, verifyOrderId, addAddress, deleteOrder} = require("../controllers/orderController");

router.get('/getAllOrders', auth, getAllOrders)

router.get('/getOrderDetails/:orderId', auth, getOrderDetails)

router.post('/createPaymentOrder', auth, createPaymentOrder)

router.post('/validatePayment', auth, validatePayment)

router.post('/verifyOrderId', auth, verifyOrderId)

router.post('/addAddress', auth, addAddress)

router.delete('/deleteOrder/:orderId', auth, deleteOrder)

module.exports=router