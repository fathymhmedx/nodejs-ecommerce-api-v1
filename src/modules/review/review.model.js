const mongoose = require('mongoose');
const Product = require('../product/product.model');

const reviewSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
    },
    ratings: {
        type: Number,
        min: [1, 'Ratings must be above or equal 1.0'],
        max: [5, 'Ratings must be below or equal 5.0'],
        required: [true, 'Review ratings required'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user'],
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Review must belong to a product'],
    },
}, {
    timestamps: true,
})

// ensure one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true })

// Using pre middleware to auto-populate review relations.
// Better than ApiFeatures here because E-commerce reviews
// always need user/product data consistently.
reviewSchema.pre(/^find/, function () {
    this.populate({
        path: 'user',
        select: 'name'
    })
});

reviewSchema.statics.calcAvgRatingsAndQuantity = async function (productId) {
    const result = await this.aggregate([
        // Stage1: Get all reviews on specific prodcut
        {
            $match: { product: productId }
        },
        // Stage2: Grouping reviews based on productId and calc avgRatings 
        {
            $group: {
                _id: "$product",
                avgRatings: { $avg: "$ratings" },
                ratingsQuantity: { $sum: 1 }
            }
        }
    ])

    if (result.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: result[0].avgRatings,
            ratingQuantity: result[0].ratingsQuantity
        })
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: 0,
            ratingQuantity: 0
        })
    }
}

// After saving a review (create/update), recalculate the product's average rating and total rating quantity
reviewSchema.post('save', async function () {
    await this.constructor.calcAvgRatingsAndQuantity(this.product);
});

// triggers after findByIdAndDelete
reviewSchema.post('findOneAndDelete', async function (doc) {
    if (doc) await doc.constructor.calcAvgRatingsAndQuantity(doc.product);
});


const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;