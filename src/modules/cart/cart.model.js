const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    cartItems: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 1,
        },
        color: String,
        price: Number,
    }],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    isDiscountApplied: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }

}, {
    timestamps: true
})

cartSchema.methods.calculateTotalPrice = function () {
    let totalPrice = 0;

    this.cartItems.forEach(item => {
        totalPrice += item.quantity * item.price;
    });

    this.totalCartPrice = totalPrice;

    this.totalPriceAfterDiscount = undefined;
    this.isDiscountApplied = false;
    return totalPrice;
}


const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;