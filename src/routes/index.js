const express = require('express');
const router = express.Router();

// const authRoutes = require('../src/modules/auth/auth.routes');
const brandRoutes = require('../modules/brand/brand.routes');
const categoryRoutes = require('../modules/category/category.routes');
const productRoutes = require('../modules/product/product.routes');
const subCategoryRoutes = require('../modules/subCategory/subCategory.routes');
const userRoutes = require('../modules/user/user.routes');


// router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/brands', brandRoutes);
router.use('/subcategories', subCategoryRoutes); 
router.use('/users', userRoutes);

module.exports = router;