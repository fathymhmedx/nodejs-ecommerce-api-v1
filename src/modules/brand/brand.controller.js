// Controls requests and responses
/** @type {import('mongoose').Model} */
const Brand = require('./brand.model');
const ApiError = require('../../shared/errors/ApiError');
const ApiFeatures = require('../../shared/utils/features/apiFeatures');
const factory = require('../../shared/utils/handlers/handlerFactory');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');

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
    const baseQuery = Brand.find();

    // Apply API Features (filtering, searching, sorting, field limiting, pagination)
    const features = new ApiFeatures(baseQuery, req.query)
        .filter()
        .search()
        .sort()
        .limitFields();

    // 1) Get total count first
    const total = await Brand.countDocuments(features.mongooseQuery._conditions);

    // 2) Apply pagination after knowing total
    features.paginate(total);

    // 3) Run query (after pagination) in parallel with nothing else (but still scalable)
    const [brands] = await Promise.all([
        features.mongooseQuery.lean()
    ]);

    // Response
    res.status(200).json({
        status: 'success',
        meta: {
            ...features.paginationResult,
        },
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

exports.updateBrand = factory.updateOne(Brand);

/**
 * @route   DELETE /api/v1/brands/:id
 * @desc    Delete a specific brand by ID
 * @access  private
 */
exports.deleteBrand = factory.deleteOne(Brand);
