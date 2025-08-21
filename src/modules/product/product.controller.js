// Controls requests and responses
/** @type {import('mongoose').Model} */
const Product = require('./product.model');
const ApiError = require('../../shared/errors/ApiError');
const ApiFeatures = require('../../shared/utils/features/apiFeatures');
const factory = require('../../shared/utils/handlers/handlerFactory');

const slugify = require('slugify');
const asyncHandler = require('express-async-handler');

/**
 * @route   POST /api/v1/products
 * @desc    Create new product
 * @access  private
 */
exports.createProduct = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        quantity,
        sold,
        price,
        priceAfterDiscount,
        colors,
        images,
        imageCover,
        category,
        subCategories,
        brand,
        ratingsAverage,
        ratingQuantity
    } = req.body;

    const createData = {
        title,
        description,
        quantity,
        sold,
        price,
        priceAfterDiscount,
        colors,
        images,
        imageCover,
        category,
        subCategories,
        brand,
        ratingsAverage,
        ratingQuantity
    }

    if (title) {
        createData.slug = slugify(title);
    }
    const product = await Product.create(createData);

    res.status(201).json({
        status: 'success',
        data: {
            product
        }
    })
});

/**
 * @route   GET /api/v1/products
 * @desc    Get all products
 * @access  public
 */
exports.getProducts = asyncHandler(async (req, res) => {
    const baseQuery = Product.find();
    // Apply API Features (filtering, searching, sorting, field limiting, pagination)
    const features = new ApiFeatures(baseQuery, req.query)
        .filter()
        .search()
        .sort()
        .limitFields()
        .populate('category', 'name -_id');

    // 1) Get total count first
    const total = await Product.countDocuments(features.mongooseQuery._conditions);

    // 2) Apply pagination after knowing total
    features.paginate(total);

    // 3) Run query (after pagination) in parallel with nothing else (but still scalable)
    const [products] = await Promise.all([
        features.mongooseQuery.lean()
    ]);

    // Response
    res.status(200).json({
        status: 'success',
        meta: {
            ...features.paginationResult,
        },
        data: {
            products
        }
    })
});


/**
 * @route   GET /api/v1/products/:id
 * @desc    Get specific product
 * @access  public
 */
exports.getProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id).lean().populate({ path: 'category', select: 'name -_id' });

    if (!product) {
        return next(new ApiError(`No product found for id: ${id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    })
})

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