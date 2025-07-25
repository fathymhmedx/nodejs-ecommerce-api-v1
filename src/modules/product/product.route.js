const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { createProductValidator, getProductValidator, updateProductValidator, deleteProductValidator } = require('../validators/productValidators')
/**
 * @route GET, POST /api/v1/products
 * @access private
 */
router
    .route('/')
    .post(createProductValidator, createProduct)
    .get(getProducts)

/**
 * @route GET, PUT, DELETE /api/v1/products/:id
 * @access private
 */
router
    .route('/:id')
    .get(getProductValidator, getProduct)
    .put(updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct)

module.exports = router;