const express = require('express');
const router = express.Router();
const { uploadProductImages, resizeProductImages, createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('./product.controller');
const { createProductValidator, getProductValidator, updateProductValidator, deleteProductValidator } = require('./product.validators')
const { protect, authorizeRoles } = require('../../shared/middlewares/authMiddleware');

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