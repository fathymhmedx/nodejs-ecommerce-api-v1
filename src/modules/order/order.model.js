const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Order must be belong to user']
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product'
            },
            color: String,
            quantity: Number,
            price: Number
        }
    ],
    taxPercentage: {
        type: Number,
        default: 14
    },
    shippingAddress: {
        details: String,
        phone: String,
        city: String,
        postalCode: String,
    },
    shippingPrice: {
        type: Number,
        default: 0
    },
    totalOrderPrice: Number,
    paymentMethodType: {
        type: String,
        enum: ['card', 'cash'],
        default: 'cash'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date

}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;