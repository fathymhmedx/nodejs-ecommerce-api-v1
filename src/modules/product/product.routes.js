const express = require('express');
const router = express.Router();

const { uploadProductImages,
    resizeProductImages,
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getTopProducts,
    getLatestProducts,
    getRelatedProducts,
    getTopRatedProducts
} = require('./product.controller');
const { createProductValidator, getProductValidator, updateProductValidator, deleteProductValidator } = require('./product.validators')
const reviewsRoute = require('../review/review.routes');
const { protect, authorizeRoles } = require('../../shared/middlewares/authMiddleware');

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
 * @desc    Get top 10 Products with redis
 */
router
    .route('/top-ten')
    .get(getTopProducts)

/**
 * @dec Latest & Top Rated & Related
 */
router
    .route('/latest')
    .get(getLatestProducts);

router
    .route('/top-rated')
    .get(getTopRatedProducts);

router
    .route('/:id/related')
    .get(getRelatedProducts);
/**
 * @desc    Get all products with populated category name only
 */
router
    .route('/')
    .get(getProducts)
    /**
     * @desc    Create a new product
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
 * @desc    Get details of a specific product by ID
 */
router
    .route('/:id')
    .get(getProductValidator, getProduct)
    /**
     * @desc    Update a specific product by ID
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
     * @desc    Delete a specific product by ID
     */
    .delete(
        protect,
        authorizeRoles('admin'),
        deleteProductValidator,
        deleteProduct
    )


module.exports = router;




