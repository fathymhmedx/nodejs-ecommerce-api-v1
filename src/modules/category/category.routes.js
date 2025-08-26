const express = require('express');
const router = express.Router();
const subCategoryRoutes = require('../subCategory/subCategory.routes');
const { uploadCategoryImage, resizeImage, createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('./category.controller');
const { getCategoryValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator } = require('./category.validators');

/**
 * @route GET /api/v1/categories/:categoryId/subcategories
 * @desc Get subCategories by categoryId
 * 
 * @route POST GET /api/v1/categories/:categoryId/subcategories
 * @desc Create subCategory from categroyId
*/
router.use('/:categoryId/subcategories', subCategoryRoutes)

/**
 * @route GET, POST /api/v1/categories
 * @access private
*/
router
    .route('/')
    .get(getCategories)
    .post(
        uploadCategoryImage,
        resizeImage,
        createCategoryValidator,
        createCategory
    );

/**
 * @route GET, PUT, DELETE /api/v1/categories/:id
 * @access private
 */
router
    .route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(
        uploadCategoryImage,
        resizeImage,
        updateCategoryValidator,
        updateCategory
    )
    .delete(deleteCategoryValidator, deleteCategory)


module.exports = router;