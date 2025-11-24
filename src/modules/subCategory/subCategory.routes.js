const express = require('express');
const router = express.Router({ mergeParams: true });
const { createSubCategory, setCategoryIdToBody, createFilterObj, getSubCategories, getSubCategory, updateSubCategory, deleteSubCategory } = require('./subCategory.controller');
const { createSubCategoryValidator, getSubCategoryValidator, updateSubCategoryValidator, deleteSubCategoryValidator } = require('./subCategory.validators');
const { protect, authorizeRoles } = require('../../shared/middlewares/authMiddleware');

/**
 * @route   GET /api/v1/subcategories
 * @desc    Get all subcategories, optionally filtered by categoryId if accessed via nested category route
 * @access  Public
 */
router
    .route('/')
    .get(createFilterObj, getSubCategories)
    /**
     * @route   POST /api/v1/subcategories
     * @desc    Create a new subcategory. 
     *         If called via nested route (/categories/:categoryId/subcategories), 
     *         the categoryId will be automatically set in the request body.
     * @access  Private (admin, manager)
     */
    .post(
        protect,
        authorizeRoles('admin', 'manager'),
        setCategoryIdToBody,
        createSubCategoryValidator,
        createSubCategory
    )

/**
 * @route   GET /api/v1/subcategories/:id
 * @desc    Get details of a specific subcategory by ID
 * @access  Public
 */
router
    .route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    /**
     * @route   PUT /api/v1/subcategories/:id
     * @desc    Update a specific subcategory by ID
     * @access  Private (admin, manager)
     */
    .put(
        protect,
        authorizeRoles('admin', 'manager'),
        updateSubCategoryValidator,
        updateSubCategory
    )
    /**
     * @route   DELETE /api/v1/subcategories/:id
     * @desc    Delete a specific subcategory by ID
     * @access  Private (admin)
     */
    .delete(
        protect,
        authorizeRoles('admin'),
        deleteSubCategoryValidator,
        deleteSubCategory
    )

module.exports = router;