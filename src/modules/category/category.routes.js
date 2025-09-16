const express = require('express');
const router = express.Router();
const subCategoryRoutes = require('../subCategory/subCategory.routes');
const { uploadCategoryImage, resizeAndSaveSingleImage, createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('./category.controller');
const { getCategoryValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator } = require('./category.validators');
const { protect, authorizeRoles } = require('../../shared/middlewares/authMiddleware');

/**
 * @route   GET /api/v1/categories/:categoryId/subcategories
 * @desc    Get all subcategories under a specific category
 * @access  Public
 */

/**
 * @route   POST /api/v1/categories/:categoryId/subcategories
 * @desc    Create a new subcategory under a specific category
 * @access  Private (admin, manager)
 */
router.use('/:categoryId/subcategories', subCategoryRoutes)

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories
 * @access  Public
 */
router
    .route('/')
    .get(getCategories)
    /**
     * @route   POST /api/v1/categories
     * @desc    Create a new category
     * @access  Private (admin, manager)
     */
    .post(
        protect,
        authorizeRoles('admin', 'manager'),
        uploadCategoryImage,
        resizeAndSaveSingleImage,
        createCategoryValidator,
        createCategory
    );

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Get details of a specific category by ID
 * @access  Public
 */
router
    .route('/:id')
    .get(getCategoryValidator, getCategory)
    /**
     * @route   PUT /api/v1/categories/:id
     * @desc    Update a specific category by ID
     * @access  Private (admin, manager)
     */
    .put(
        protect,
        authorizeRoles('admin', 'manager'),
        uploadCategoryImage,
        resizeAndSaveSingleImage,
        updateCategoryValidator,
        updateCategory
    )
    /**
     * @route   DELETE /api/v1/categories/:id
     * @desc    Delete a specific category by ID
     * @access  Private (admin)
     */
    .delete(
        protect,
        authorizeRoles('admin'),
        deleteCategoryValidator,
        deleteCategory
    )


module.exports = router;