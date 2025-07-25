const express = require('express');
const router = express.Router({ mergeParams: true });
const { createSubCategory, setCategoryIdToBody, getSubCategories, getSubCategory, updateSubCategory, deleteSubCategory } = require('./subCategory.controller');
const { createSubCategoryValidator, getSubCategoryValidator, updateSubCategoryValidator, deleteSubCategoryValidator } = require('./subCategory.validators');

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
    .post(
        setCategoryIdToBody,
        createSubCategoryValidator,
        createSubCategory
    )
    .get(getSubCategories)

/**
 * @route GET, PUT, DELETE /api/v1/subcategories/:id
 * @desc Get, put, delete subCategory by id 
 * @access private
 */
router
    .route('/:id')
    .get(
        getSubCategoryValidator,
        getSubCategory
    )
    .put(
        updateSubCategoryValidator,
        updateSubCategory
    )
    .delete(
        deleteSubCategoryValidator,
        deleteSubCategory
    )

module.exports = router;