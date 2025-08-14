// Controls requests and responses
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
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 2) Advanced Filtering (Numeric parsing, Regex search)
    let mongoQuery = {};

    for (const key in queryObj) {
        // Multi-value filtering
        if (typeof queryObj[key] === 'string' && queryObj[key].includes(',')) {
            mongoQuery[key] = { $in: queryObj[key].split(',') };
            continue;
        }

        const value = isNaN(queryObj[key]) ? queryObj[key] : Number(queryObj[key]);
        const match = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/);

        if (match) {
            const [, field, operator] = match;
            if (!mongoQuery[field]) mongoQuery[field] = {};
            mongoQuery[field][`$${operator}`] = value;
        } else {
            if (typeof value === 'string') {
                mongoQuery[key] = { $regex: value, $options: 'i' };
            } else {
                mongoQuery[key] = value;
            }
        }
    }

    // 3) Sorting
    let sortBy = "-createdAt"; // Default sort
    if (req.query.sort) {
        sortBy = req.query.sort.split(',').join(' ');
    }


    // 4) Field Limiting
    let selectFields = '-__v';
    if (req.query.fields) {
        selectFields = req.query.fields.split(',').join(' ');
    }

    // 5) Search
    if (req.query.keyword) {
        mongoQuery.$or = [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } }
        ];
    }
    console.log(mongoQuery);
    // 5) Pagination
    const { page, limit, skip } = getPagination(req.query);

    // 6) Execute queries in parallel
    const [total, products] = await Promise.all([
        Product.countDocuments(mongoQuery),
        Product.find(mongoQuery)
            .select(selectFields)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .lean()
            .populate({ path: 'category', select: 'name -_id' })
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