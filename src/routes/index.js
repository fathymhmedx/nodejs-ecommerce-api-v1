const express = require('express');
const router = express.Router();

const authRoutes = require('../modules/auth/auth.routes');
const brandRoutes = require('../modules/brand/brand.routes');
const categoryRoutes = require('../modules/category/category.routes');
const productRoutes = require('../modules/product/product.routes');
const subCategoryRoutes = require('../modules/subCategory/subCategory.routes');
const userRoutes = require('../modules/user/user.routes');
const reviewRoutes = require('../modules/review/review.routes');
const wishlistRoutes = require('../modules/user/wishlist/wishlist.routes');
const addressRoutes = require('../modules/user/addresses/addresses.routes');
const couponRoutes = require('../modules/coupon/coupon.routes');
const cartRoutes = require('../modules/cart/cart.routes');

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/brands', brandRoutes);
router.use('/subcategories', subCategoryRoutes);
router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/addresses', addressRoutes);
router.use('/coupons', couponRoutes);
router.use('/cart', cartRoutes);

module.exports = router;