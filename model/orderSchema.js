const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderDetails: [{
        productId: {
            type: String,
            required: true
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
        }
    }],
    expiryTime: {
        type: Date,
        default: Date.now,
        index: { expires: 0 }
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
