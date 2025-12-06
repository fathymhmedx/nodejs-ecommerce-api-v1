const express = require('express');
const router = express.Router();

const { addProductToWishlist, removeProductToWishlist, getLoggedUserWishlist } = require('./wishlist.controller');
const { addToWishlistValidator, removeFromWishlistValidator } = require('./wishlist.validators');
const { protect, authorizeRoles } = require('../../../shared/middlewares/authMiddleware');
const { addToWishlistLimiter,removeFromWishlistLimiter } = require('./wishlist.rateLimiter');


router.use(protect, authorizeRoles('user'));

router
    .route('/')
    .post(
        addToWishlistLimiter,
        addToWishlistValidator,
        addProductToWishlist
    )
    .get(
        getLoggedUserWishlist
    )
router
    .route('/:productId')
    .delete(
        removeFromWishlistLimiter,
        removeFromWishlistValidator,
        removeProductToWishlist
    )

module.exports = router;