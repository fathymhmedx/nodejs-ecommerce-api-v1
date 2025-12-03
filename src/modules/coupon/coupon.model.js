const mongoose = require('mongoose');
const couponSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Coupon name is required'],
        unique: true,
        minlength: [3, 'Coupon name must be at least 3 characters long'],
        maxlength: [30, 'Coupon name must not exceed 30 characters']
    },
    expire: {
        type: Date,
        required: [true, 'Coupon expire time value is required'],
        validate: {
            validator: (value) => value > Date.now(),
            message: 'Expire date must be in the future'
        }

    },
    isActive: {
        type: Boolean,
        default: true
    },
    discount: {
        type: Number,
        required: [true, 'Coupon discount time value is required'],
        min: [1, 'Discount must be at least 1%'],
        max: [100, 'Discount cannot exceed 100%']
    }
}, {
    timestamps: true,
})
const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;