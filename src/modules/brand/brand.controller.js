// Controls requests and responses
/** @type {import('mongoose').Model} */
const Brand = require('./brand.model');
const factory = require('../../shared/utils/handlers/handlerFactory');
const { uploadSingleImage, resizeAndSaveSingleImage } = require('../../shared/middlewares/uploadImageMiddleware');

exports.uploadBrandImage = uploadSingleImage('image');

exports.resizeAndSaveSingleImage = resizeAndSaveSingleImage('brands', 'image', 600, 600);
/**
 * @route   POST /api/v1/brands
 * @desc    Create new brand
 * @access  private
 */
exports.createBrand = factory.createOne(Brand);

/**
 * @route   GET /api/v1/brands
 * @desc    Get paginated list of brands
 * @access  public
 */
exports.getBrands = factory.getAll(Brand);

/**
 * @route   GET /api/v1/brands/:id
 * @desc    Get a specific brand by ID
 * @access  public
 */
exports.getBrand = factory.getOne(Brand);

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
