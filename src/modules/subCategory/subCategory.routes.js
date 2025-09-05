const express = require('express');
const router = express.Router({ mergeParams: true });
const { createSubCategory, setCategoryIdToBody, createFilterObj, getSubCategories, getSubCategory, updateSubCategory, deleteSubCategory } = require('./subCategory.controller');
const { createSubCategoryValidator, getSubCategoryValidator, updateSubCategoryValidator, deleteSubCategoryValidator } = require('./subCategory.validators');
const { protect, authorizeRoles } = require('../../shared/middlewares/authMiddleware');

/**
 * @route   GET /api/v1/subcategories
 *          POST /api/v1/subcategories
 *          GET /api/v1/categories/:categoryId/subcategories
 *          POST /api/v1/categories/:categoryId/subcategories
 * @desc    Get all subCategories (optionally filtered by category), or create new subCategory(created from categoryId)
 * @access  Private
 */

router
    .route('/')
    .get(createFilterObj, getSubCategories)
    .post(
        protect,
        authorizeRoles('admin', 'manager'),
        createSubCategoryValidator,
        setCategoryIdToBody,
        createSubCategory
    )

/**
 * @route GET, PUT, DELETE /api/v1/subcategories/:id
 * @desc Get, put, delete subCategory by id 
 * @access private
 */
router
    .route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(
        protect,
        authorizeRoles('admin', 'manager'),
        updateSubCategoryValidator,
        updateSubCategory
    )
    .delete(
        protect,
        authorizeRoles('admin'),
        deleteSubCategoryValidator,
        deleteSubCategory
    )

module.exports = router;