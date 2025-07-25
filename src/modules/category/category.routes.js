const express = require('express');
const router = express.Router();
const subCategoryRoutes = require('../subCategory/subCategory.route');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { getCategoryValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator } = require('../validators/categoryValidators');

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
    .post(createCategoryValidator, createCategory);

/**
 * @route GET, PUT, DELETE /api/v1/categories/:id
 * @access private
 */
router
    .route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory)


module.exports = router;