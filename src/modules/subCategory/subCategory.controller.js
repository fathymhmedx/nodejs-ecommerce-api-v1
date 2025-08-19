// Controls requests and responses
/** @type {import('mongoose').Model} */
const SubCategory = require('./subCategory.model');
const ApiError = require('../../shared/errors/ApiError');
const ApiFeatures = require('../../shared/utils/features/apiFeatures');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');

exports.setCategoryIdToBody = (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
};

/**
 * @desc Create new subCategory
 * @route POST /api/v1/subcategories
 * @access private
 */
exports.createSubCategory = asyncHandler(async (req, res) => {
    const { name, category } = req.body;
    const subCategory = await SubCategory.create({ name, slug: slugify(name), category });
    res.status(201).json({
        status: 'success',
        data: {
            subCategory
        }
    })
});

/**
 * @desc Get all subCategories
 * @route GET /api/v1/subcategories
 * @access public
 */
exports.getSubCategories = asyncHandler(async (req, res) => {
    const baseQuery = SubCategory.find();

    const features = new ApiFeatures(baseQuery, req.query)
        .filter()
        .search()
        .sort()
        .limitFields();

    // 1) Get total count first
    const total = await SubCategory.countDocuments(features.mongooseQuery._conditions);

    // 2) Apply pagination after knowing total
    features.paginate(total);

    // 3) Excute query (after pagination) in parallel with nothing else (but still scalable)
    const [subCategories] = await Promise.all([
        features.mongooseQuery.lean(),
    ])

    // Response 
    res.status(200).json({
        status: 'success',
        meta: {
            ...features.paginationResult,
        },
        data: {
            subCategories
        }
    })
});


/**
 * @desc Get specific subCategory 
 * @route GET /api/subcategories/:id
 * @access public
 */
exports.getSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const subCategory = await SubCategory.findById(id).lean();
    // .populate({path: 'category', select: 'name'});  // في حالتنا هنا ممش محتاجينها ف مش لازم لان كدا في 2 كويري اتطبق ف البيرفورمنس هيقل 

    if (!subCategory) {
        return next(new ApiError(`No subCategory found for id: ${id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            subCategory
        }
    })
});


/**
 * @desc Update specific subCategory
 * @route PUT /api/v1/subcategories/:id
 * @access private
 */

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, category } = req.body;
    const subCategory = await SubCategory.findByIdAndUpdate(id, { name, category, slug: slugify(name) }, {
        new: true,
        runValidators: true // validation mongoose
    })

    if (!subCategory) {
        return next(new ApiError(`No subCategory found for id: ${id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            subCategory
        }
    })
})

/**
 * @desc Delete specific subCategory
 * @route DELETE /api/subcategories/:id
 * @access private
 */

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const subCategory = await SubCategory.findByIdAndDelete(id);

    if (!subCategory) {
        return next(new ApiError(`No subCategory found for id: ${id}`, 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'SubCategory deleted successfully',
    });
});