const express = require('express');
const router = express.Router();
const { uploadProductImages, resizeProductImages, createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('./product.controller');
const { createProductValidator, getProductValidator, updateProductValidator, deleteProductValidator } = require('./product.validators')
const { protect, authorizeRoles } = require('../../shared/middlewares/authMiddleware');

/**
 * @route GET, POST /api/v1/products
 * @access private
 */
router
    .route('/')
    .get(getProducts)
    .post(
        protect,
        authorizeRoles('admin', 'manager'),
        uploadProductImages,
        resizeProductImages,
        createProductValidator,
        createProduct
    )

/**
 * @route GET, PUT, DELETE /api/v1/products/:id
 * @access private
 */
router
    .route('/:id')
    .get(getProductValidator, getProduct)
    .put(
        protect,
        authorizeRoles('admin', 'manager'),
        uploadProductImages,
        resizeProductImages,
        updateProductValidator,
        updateProduct
    )
    .delete(
        protect,
        authorizeRoles('admin'),
        deleteProductValidator,
        deleteProduct
    )

module.exports = router;