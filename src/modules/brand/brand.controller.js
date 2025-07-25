/** @type {import('mongoose').Model} */
const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/errors/ApiError');
const { getPagination } = require('../utils/apiFeatures');
const slugify = require('slugify');

/**
 * @route   POST /api/v1/brands
 * @desc    Create new brand
 * @access  private
 */
exports.createBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const brand = await Brand.create({ name, slug: slugify(name) });
    res.status(201).json({
        status: 'success',
        data: {
            brand
        }
    })
});

/**
 * @route   GET /api/v1/brands
 * @desc    Get paginated list of brands
 * @access  public
 */
exports.getBrands = asyncHandler(async (req, res, next) => {
    const { page, skip, limit } = getPagination(req.query);
    const [total, brands] = await Promise.all([
        Brand.countDocuments(),
        Brand.find().skip(skip).limit(limit).lean()
    ]);

    res.status(200).json({
        status: 'success',
        currentPage: page,
        limit: limit,
        results: brands.length,
        totalResults: total,
        totalPages: Math.ceil(total / limit),
        data: {
            brands
        }
    })

});

/**
 * @route   GET /api/v1/brands/:id
 * @desc    Get a specific brand by ID
 * @access  public
 */
exports.getBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findById(id).lean();

    if (!brand) {
        return next(new ApiError(`No brand found for id: ${id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            brand
        }
    })
});

/**
 * @route   PUT /api/v1/brands/:id
 * @desc    update a specific brand by ID
 * @access  private
 */

exports.updateBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    const brand = await Brand.findByIdAndUpdate(id, { name, slug: slugify(name) }, {
        runValidators: true,
        new: true
    });

    if (!brand) {
        return next(new ApiError(`No brand found for id: ${id}`, 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            brand
        }
    })
});

/**
 * @route   DELETE /api/v1/brands/:id
 * @desc    Delete a specific brand by ID
 * @access  private
 */
exports.deleteBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);

    if (!brand) {
        return next(new ApiError(`No brand found for id: ${id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Brand deleted successfully',
    });
});