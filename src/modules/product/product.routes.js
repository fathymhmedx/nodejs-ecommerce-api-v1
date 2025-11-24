const express = require('express');
const router = express.Router();

const { uploadProductImages, resizeProductImages, createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('./product.controller');
const { createProductValidator, getProductValidator, updateProductValidator, deleteProductValidator } = require('./product.validators')
const reviewsRoute = require('../review/review.routes');
const { protect, authorizeRoles } = require('../../shared/middlewares/authMiddleware');

/**
 * @route GET /api/v1/products/:productId/reviews
 * @desc Get all reviews for a specific product
 * @access Public
 */

/**
 * @route GET /api/v1/products/:productId/reviews/:id
 * @desc Get a single review under a specific product
 * @access Public
 */

/**
 * @route POST /api/v1/products/:productId/reviews
 * @desc Create a new review under a specific product
 * @access Private (User)
 */
router.use("/:productId/reviews", reviewsRoute);

/**
 * @route   GET /api/v1/products/:productId/reviews
 * @desc    Get all Reviews under a specific product
 * @access  public
 */

/**
 * @route   GET /api/v1/products/:productId/reviews/:id
 * @desc    Get specific review under a specific product
 * @access  public
 */

/**
 * @route   POST /api/v1/products/:productId/reviews
 * @desc    Create a new reviews under a specific product
 * @access  private (user)
 */

router.use("/:productId/reviews", reviewsRoute);

/**
 * @route   GET /api/v1/products
 * @desc    Get all products with populated category name only
 * @access  Public
 */
router
    .route('/')
    .get(getProducts)
    /**
     * @route   POST /api/v1/products
     * @desc    Create a new product
     * @access  Private (admin, manager)
     */
    .post(
        protect,
        authorizeRoles('admin', 'manager'),
        uploadProductImages,
        resizeProductImages,
        createProductValidator,
        createProduct
    )

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get details of a specific product by ID
 * @access  Public
 */
router
    .route('/:id')
    .get(getProductValidator, getProduct)
    /**
     * @route   PUT /api/v1/products/:id
     * @desc    Update a specific product by ID
     * @access  Private (admin, manager)
     */
    .put(
        protect,
        authorizeRoles('admin', 'manager'),
        uploadProductImages,
        resizeProductImages,
        updateProductValidator,
        updateProduct
    )
    /**
     * @route   DELETE /api/v1/products/:id
     * @desc    Delete a specific product by ID
     * @access  Private (admin)
     */
    .delete(
        protect,
        authorizeRoles('admin'),
        deleteProductValidator,
        deleteProduct
    )

module.exports = router;