// Controls requests and responses
/** @type {import('mongoose').Model} */
const SubCategory = require('./subCategory.model');
const factory = require('../../shared/utils/handlers/handlerFactory');


// middleware: set categoryId in body if coming from nested route
exports.setCategoryIdToBody = (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
};

// Nested Route GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
    let filterObj = {};

    if (req.params.categoryId) filterObj = { category: req.params.categoryId };
    req.filterObj = filterObj;
    next();
}
/**
 * @desc Create new subCategory
 * @route POST /api/v1/subcategories
 * @access private
 */
exports.createSubCategory = factory.createOne(SubCategory);

/**
 * @desc Get all subCategories
 * @route GET /api/v1/subcategories
 * @access public
 */
exports.getSubCategories = factory.getAll(SubCategory);


/**
 * @desc Get specific subCategory 
 * @route GET /api/subcategories/:id
 * @access public
 */
exports.getSubCategory = factory.getOne(SubCategory);


/**
 * @desc Update specific subCategory
 * @route PUT /api/v1/subcategories/:id
 * @access private
 */

exports.updateSubCategory = factory.updateOne(SubCategory);

/**
 * @desc Delete specific subCategory
 * @route DELETE /api/subcategories/:id
 * @access private
 */
exports.deleteSubCategory = factory.deleteOne(SubCategory);