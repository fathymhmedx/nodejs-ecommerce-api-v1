const express = require('express');
const router = express.Router();
const { uploadBrandImage, resizeAndSaveSingleImage, createBrand, getBrands, getBrand, updateBrand, deleteBrand } = require('./brand.controller');
const { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator } = require('./brand.validators')
const { protect, authorizeRoles } = require('../../shared/middlewares/authMiddleware');

/**
 * @route   GET /api/v1/brands
 * @desc    Get paginated list of all brands
 * @access  Public
 */
router
    .route('/')
    .get(getBrands)
    /**
     * @route   POST /api/v1/brands
     * @desc    Create a new brand
     * @access  Private (admin, manager)
     */
    .post(
        protect,
        authorizeRoles('admin', 'manager'),
        uploadBrandImage,
        resizeAndSaveSingleImage,
        createBrandValidator,
        createBrand
    )

/**
 * @route   GET /api/v1/brands/:id
 * @desc    Get details of a specific brand by ID
 * @access  Public
 */
router
    .route('/:id')
    .get(getBrandValidator, getBrand)
    /**
     * @route   PUT /api/v1/brands/:id
     * @desc    Update a specific brand by ID
     * @access  Private (admin, manager)
     */
    .put(
        protect,
        authorizeRoles('admin', 'manager'),
        uploadBrandImage,
        resizeAndSaveSingleImage,
        updateBrandValidator,
        updateBrand
    )
    /**
     * @route   DELETE /api/v1/brands/:id
     * @desc    Delete a specific brand by ID
     * @access  Private (admin)
     */
    .delete(
        protect,
        authorizeRoles('admin'),
        deleteBrandValidator,
        deleteBrand
    )


module.exports = router;