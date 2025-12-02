const mongoose = require('mongoose');
const Schema= mongoose.Schema

const addressSchema= new Schema({
    name:{
        type: String,
        required: true
    },
    contactNumber:{
        type: Number,
        required: true
    },
    streetAddress:{
        type: String,
        required: true
    },
    locality:{
        type: String,
        required: true
    },
    region:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    pinCode:{
        type: Number,
        required: true
    },
    additionInfo:{
        type: String,
        required:false
    }
})

const orderSchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    deliveryAddress:{
        type: addressSchema,
        required: false
    },
    orderDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderDetails: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true
        },
        pricePerUnit: {
            type: Number,
            required: true
        },
        subtotal: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
            required: true
        },
    }],
    expiryTime: {
        type: Date,
        default: Date.now,
        index: { expires: 0 }
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
