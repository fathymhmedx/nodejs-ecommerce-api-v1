// Controls requests and responses
/** @type {import('mongoose').Model} */
const Product = require('./product.model');
const factory = require('../../shared/utils/handlers/handlerFactory');


/**
 * @route   POST /api/v1/products
 * @desc    Create new product
 * @access  private
 */
exports.createProduct = factory.createOne(Product);

/**
 * @route   GET /api/v1/products
 * @desc    Get all products
 * @access  public
 */
exports.getProducts = factory.getAll(Product);


/**
 * @route   GET /api/v1/products/:id
 * @desc    Get specific product
 * @access  public
 */
exports.getProduct = factory.getOne(Product);

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