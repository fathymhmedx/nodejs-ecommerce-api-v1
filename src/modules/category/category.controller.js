/** @type {import('mongoose').Model} */
const Category = require('./category.model');
const factory = require('../../shared/utils/handlers/handlerFactory');

const { uploadSingleImage, resizeAndSaveSingleImage } = require('../../shared/middlewares/uploadImageMiddleware');

exports.uploadCategoryImage = uploadSingleImage('image');

exports.resizeAndSaveSingleImage = resizeAndSaveSingleImage('categories', 'image', 600, 600);

/**
 * @desc Create new category
 * @route POST /api/v1/categories
 * @access private
 */

exports.createCategory = factory.createOne(Category);


/**
 * @desc Get all categories
 * @route GET /api/v1/categories
 * @access public
 */
exports.getCategories = factory.getAll(Category);

/**
 * @desc  Get Specific category
 * @route GET /api/v1/categories/:id
 * @access public
 */
exports.getCategory = factory.getOne(Category);

/**
 * @desc Update specific category
 * @route PUT /api/v1/categories/:id
 * @access private
 */
exports.updateCategory = factory.updateOne(Category);

/**
 * @desc Delete specific category
 * @route DELETE /api/v1/categories/:id
 * @access private
 */
exports.deleteCategory = factory.deleteOne(Category);