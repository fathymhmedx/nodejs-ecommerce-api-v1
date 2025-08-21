const mongoose = require('mongoose');
const slugifyPlugin = require('../../shared/utils/plugins/slugifyPlugin');

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        minlength: [3, "Product title must be at least 3 characters long"],
        maxlength: [100, "Product title must not exceed 32 characters"],
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        minlength: [20, "Product description must be at least 20 characters long"],
    },
    quantity: {
        type: Number,
        min: [0, 'Quantity must be a non-negative intege'],
        required: [true, 'Product quantity is required']
    },
    sold: {
        type: Number,
        min: [0, 'sold must be a non-negative intege'],
        default: 0
    },
    price: {
        type: Number,
        trim: true,
        required: [true, 'Product price is required'],
        min: [0, 'Price must be a non-negative number'],
        max: [200000, 'Too long product price']
    },
    priceAfterDiscount: {
        type: Number
    },
    colors: [String],
    images: [String],
    imageCover: {
        type: String,
        required: [true, 'Product image cover is required']
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Product must be belong to Category']
    },
    subCategories: [{
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory'
    }],
    brand: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brand'
    },
    ratingsAverage: {
        type: Number,
        min: [1, 'Rating must be above or equal 1.0'],
        max: [5, 'Rating must be below or equal 5.0']
    },
    ratingQuantity: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});


productSchema.plugin(slugifyPlugin, { sourceField: 'title', slugField: 'slug' });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;