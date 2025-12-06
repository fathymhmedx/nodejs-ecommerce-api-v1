const asyncHandler = require('express-async-handler');
/** @type {import('mongoose').Model} */
const Product = require('./product.model');
const ApiError = require('../../shared/errors/ApiError');
const factory = require('../../shared/utils/handlers/handlerFactory');
const redisClient = require('../../shared/config/redis');
const { uploadFields, resizeProductImages } = require('../../shared/middlewares/uploadImageMiddleware');

// Upload product images (cover + gallery)
exports.uploadProductImages = uploadFields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]);

exports.resizeProductImages = resizeProductImages;
/**
 * @route   POST /api/v1/products
 * @desc    Create new product
 * @access  private
 */
exports.createProduct = factory.createOne(Product);

/**
 * @route   GET /api/v1/products
 * @desc    Get all products
 * @access  public
 */
exports.getProducts = factory.getAll(Product, { path: 'category', select: 'name _id' });


/**
 * @route   GET /api/v1/products/:id
 * @desc    Get specific product
 * @access  public
 */
exports.getProduct = factory.getOne(Product, { path: 'reviews' });

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Update specific product
 * @access  private
 */
exports.updateProduct = factory.updateOne(Product);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete specific product
 * @access  private
 */
exports.deleteProduct = factory.deleteOne(Product);

/**
 * @route   GET /api/v1/products/top-ten
 * @desc    Get top 10 Products with redis
 * @access  public
 */

exports.getTopProducts = asyncHandler(async (req, res, next) => {
    const cacheKey = 'top-products';

    let products = await redisClient.get(cacheKey);

    if (products) {
        products = JSON.parse(products);
        // console.log('Fetched from cache');
    } else {
        products = await Product.find()
            .sort({ sold: -1 })
            .limit(10);

        // Cache for one hour
        await redisClient.set(cacheKey, JSON.stringify(products), { Ex: 3600 });
        // console.log('Fetched from DB and cached');
    }

    res.status(200).json({
        status: "success",
        results: products.length,
        data: {
            products
        }
    })
});

/**
 * @route   GET /api/v1/products/latest
 * @desc    Get latest products
 * @access  public
 */
exports.getLatestProducts = asyncHandler(async (req, res, next) => {
    const cacheKey = 'latest-products';

    let products = await redisClient.get(cacheKey);
    if (products) {
        products = JSON.parse(products);
    } else {
        products = await Product.find()
            .sort({ createdAt: -1 })
            .limit(10)

        await redisClient.set(cacheKey, JSON.stringify(products), { EX: 3600 });
    }

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: { products }
    });
});

/**
 * @route   GET /api/v1/products/top-rated
 * @desc    Get top rated products
 * @access  public
 */
exports.getTopRatedProducts = asyncHandler(async (req, res, next) => {
    const cacheKey = 'top-rated-products';

    let products = await redisClient.get(cacheKey);
    if (products) {
        products = JSON.parse(products);
    } else {
        products = await Product.find()
            .sort({ ratingsAverage: -1 })
            .limit(10)

        await redisClient.set(cacheKey, JSON.stringify(products), { EX: 3600 });
    }

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: {
            products
        }
    });
});


/**
 * @route   GET /api/v1/products/:id/related
 * @desc    Get related products (same category)
 * @access  public
 */
exports.getRelatedProducts = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const currentProduct = await Product.findById(id);
    if (!currentProduct) {
        return next(new ApiError('Product not found', 404));
    }

    const relatedProducts = await Product.find({
        _id: { $ne: id }, // exclude current product
        category: currentProduct.category
    }).limit(10)

    res.status(200).json({
        status: 'success',
        results: relatedProducts.length,
        data: {
            products: relatedProducts
        }
    });
});
