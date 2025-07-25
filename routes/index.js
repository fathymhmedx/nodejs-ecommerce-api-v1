const express = require('express');
const router = express.Router();

// const authRoutes = require('../src/modules/auth/auth.routes');
const brandRoutes = require('../src/modules/brand/brand.routes');
const categoryRoutes = require('../src/modules/category/category.routes');
const productRoutes = require('../src/modules/product/product.routes');
const subCategoryRoutes = require('../src/modules/subCategory/subCategory.routes');
// const userRoutes = require('../src/modules/user/user.routes');


// router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/brands', brandRoutes);
router.use('/subcategories', subCategoryRoutes); 
// router.use('/users', userRoutes);

module.exports = router;