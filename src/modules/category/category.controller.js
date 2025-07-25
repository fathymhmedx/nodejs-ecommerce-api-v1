// Controls requests and responses
/** @type {import('mongoose').Model} */
const Category = require('./category.model');
const ApiError = require('../../shared/errors/ApiError');
const { getPagination } = require('../../shared/utils/features/apiFeatures');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
/**
 * @desc Create new category
 * @route POST /api/v1/categories
 * @access private
 */

exports.createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const category = await Category.create({ name, slug: slugify(name) });
    res.status(201).json({
        status: "success",
        data: {
            category
        }
    })
});


/**
 * @desc Get all categories
 * @route GET /api/v1/categories
 * @access public
 */
exports.getCategories = asyncHandler(async (req, res) => {
    // 1. Pagination setup
    const { page, limit, skip } = getPagination(req.query);

    // 2. Get total and paginated data

    // This method is slower than the other method.
    // const categories = await Category.find().limit(limit).skip(skip);
    // const total = await Category.countDocuments();

    const [total, categories] = await Promise.all([
        Category.countDocuments(),
        Category.find().skip(skip).limit(limit).lean()
    ]);

    // 3. Response
    res.status(200).json({
        status: "success",
        currentPage: page,
        limit: limit,
        results: categories.length,
        totalResults: total,
        totalPages: Math.ceil(total / limit),
        data: {
            categories
        }
    })
});

/**
 * @desc  Get Specific category
 * @route GET /api/v1/categories/:id
 * @access public
 */
exports.getCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findById(id).lean();
    
    if (!category) {
        return next(new ApiError(`No category found for id: ${id}`, 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            category
        }
    })
})

/**
 * @desc Update specific category
 * @route PUT /api/v1/categories/:id
 * @access private
 */
exports.updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(id, { name, slug: slugify(name) }, {
        new: true,
        runValidators: true
    });

    if (!category) {
        return next(new ApiError(`No category found for id: ${id}`, 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            category
        }
    })
});

/**
 * @desc Delete specific category
 * @route DELETE /api/v1/categories/:id
 * @access private
 */

exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
        return next(new ApiError(`No category found for id: ${id}`, 404))
    }
    res.status(200).json({
        status: 'success',
        message: 'Category deleted successfully',
    });
})