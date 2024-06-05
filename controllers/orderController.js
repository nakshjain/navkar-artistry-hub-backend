const Order=require('../model/orderSchema')
const Product=require('../model/productSchema')
const User=require('../model/userSchema')
const Razorpay=require("razorpay")
const {validatePaymentVerification} = require("razorpay/dist/utils/razorpay-utils");

const getAllOrders=async (req,res)=>{
    try{
        const user=await User.findById(req.user._id)
        const userId=user.userId
        const orders = await Order.find({ userId: userId, expiryTime: null })
            .select('-_id -__v -expiryTime')
            .populate({
                path: 'orderDetails.product',
                select: 'name imageLinks productId'
            })
            .sort({'orderDate':-1})
        res.status(200).json({error: false, orders:orders, message:'Orders fetched successfully'})
    } catch (err){
        console.error(err);
        res.status(500).json({error:true,message:"Internal Server Error"})
    }
}
const getOrderDetails=async (req,res)=>{
    try{
        const {orderId}=req.params
        const user=await User.findById(req.user._id)
        const userId=user.userId
        const orderDetails= await Order.findOne({orderId: orderId, userId: userId})
            .select('-_id -__v -expiryTime')
            .populate({
                path: 'orderDetails.product',
                select: 'name imageLinks productId'
            })
        res.status(200).json({error: false, order:orderDetails, message:'Order fetched successfully'})
    } catch (err){
        console.error(err);
        res.status(500).json({error:true,message:"Internal Server Error"})
    }
}
const createPaymentOrder=async (req,res)=>{
    try{
        const {cart, userId}=req.body
        let orderDetails=[]
        let totalAmount=0
        if(cart){
            cart.forEach(
                (cartItem)=>{
                    const pricePerUnit=cartItem.product.price
                    const subtotal=pricePerUnit*cartItem.quantity
                    totalAmount+=subtotal
                    orderDetails.push({
                        product: cartItem.product._id,
                        quantity: cartItem.quantity,
                        pricePerUnit: pricePerUnit,
                        subtotal: subtotal
                    })
                }
            )
        }
        const expiryTime =new Date(Date.now() + 15 * 60000);

        const instance = new Razorpay({
            key_id: process.env.RAZOR_PAY_KEY_ID,
            key_secret:process.env.RAZOR_PAY_KEY_SECRET
        })

        const options={
            amount: totalAmount*100,
            currency: "INR",
            receipt: "order_rcptid_11",
            notes:{
                key1:"value3",
                key2:"value2"
            }
        }

        let status=200
        let data
        await instance.orders.create(options, function (err,order){
            if(err){
                status=500
                data=err
            } else if(order){
                status=200
                data=order
            }
        })

        if(status===200){
            const order=await new Order({
                orderId:data.id,
                userId: userId,
                totalAmount: totalAmount,
                orderDetails: orderDetails,
                expiryTime: expiryTime
            })
            await order.save()
        }
        res.status(status).json({data:data})
    } catch (err){
        console.error(err);
        res.status(500).json({error:true,message:"Internal Server Error"})
    }
}

const validatePayment=async (req, res)=>{
    try {
        const {response, paymentOrderId}=req.body
        const razorpay_signature=response.razorpay_signature
        const key_secret=process.env.RAZOR_PAY_KEY_SECRET
        const razorpay_payment_id = response.razorpay_payment_id
        const isPaymentVerified=validatePaymentVerification(
            {order_id: paymentOrderId, payment_id: razorpay_payment_id},
            razorpay_signature,
            key_secret
        )
        if(isPaymentVerified){
            let order=await Order.findOne({orderId: paymentOrderId})
            order.status='processing'
            order.expiryTime=null
            await order.save()
            const orderDetails=order.orderDetails
            for (const item of orderDetails) {
                let product = await Product.findById(item.product);
                product.quantity -= item.quantity
                if(product.quantity===0){
                    product.availability= false
                }
                await product.save()
            }
            res.status(200).json({data: { isPaymentVerified: isPaymentVerified, paymentId: razorpay_payment_id }})
        }
        else{
            await Order.deleteOne({orderId: paymentOrderId})
            res.status(500).json({data: { isPaymentVerified: isPaymentVerified }})
        }
    } catch (err){
        console.error(err);
        res.status(500).json({error:true,message:"Internal Server Error"})
    }
}

const verifyOrderId=async (req,res)=>{
   try {
       const {orderId}=req.body

       const orderCreated=await Order.findOne({orderId: orderId})
       if(orderCreated){
           res.status(200).json({message:'Order Id Verified', order: orderCreated})
       }
       else{
           res.status(500).json({message:'Invalid Order Id'})
       }
   } catch (err){
       console.error(err);
       res.status(500).json({error:true,message:"Internal Server Error"})
   }
}

const addAddress=async (req,res)=>{
    try {
        const {address, paymentOrderId}=req.body
        const user=await User.findById(req.user._id)
        const order=await Order.findOne({userId: user.userId, orderId: paymentOrderId})
        order.deliveryAddress=address
        await order.save()
        res.status(200).json({error: false, message: 'Address added to order successfully'})
    } catch (err){
        console.error(err);
        res.status(500).json({error:true,message:"Internal Server Error"})
    }
}
const deleteOrder=async (req,res)=>{
    try {
        const {orderId}=req.params
        await Order.deleteOne({orderId: orderId})
        res.status(200).json({error:false, message: 'Order deleted successfully'})
    } catch (err){
        console.error(err);
        res.status(500).json({error:true,message:"Internal Server Error"})
    }
}

module.exports={
    getAllOrders,
    createPaymentOrder,
    validatePayment,
    verifyOrderId,
    addAddress,
    deleteOrder,
    getOrderDetails
}