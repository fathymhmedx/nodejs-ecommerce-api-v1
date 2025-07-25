/** @type {import('mongoose').Model} */
const Product = require('./product.model');
const ApiError = require('../../shared/errors/ApiError');
const { getPagination } = require('../../shared/utils/features/apiFeatures');
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
    // 1) Filtering 
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach( field => delete queryObj[field]);
    
    const { page, limit, skip } = getPagination(req.query);
    const [total, products] = await Promise.all([
        Product.countDocuments(),
        Product.find().skip(skip).limit(limit).lean()
        // .populate({ path: 'category', select: 'name -_id' })
    ])

    res.status(200).json({
        status: 'success',
        currentPage: page,
        limit,
        results: products.length,
        totalResults: total,
        totalPages: Math.ceil(total / limit),
        data: {
            products
        }
    })
})

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
exports.updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
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

    const updateData = {
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
        updateData.slug = slugify(title);
    }
    const product = await Product.findByIdAndUpdate(id, updateData, {
        runValidators: true,
        new: true
    })

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
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete specific product
 * @access  private
 */
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
        return next(new ApiError(`No Product found for id: ${id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Product deleted successfully',
    })
})