const express = require('express');
const router = express.Router();

const { addProductToWishlist, removeProductToWishlist, getLoggedUserWishlist } = require('./wishlist.controller');
const { addToWishlistValidator, removeFromWishlistValidator } = require('./wishlist.validators')
const { protect, authorizeRoles } = require('../../../shared/middlewares/authMiddleware');

router.use(protect, authorizeRoles('user'));

router
    .route('/')
    .post(
        addToWishlistValidator,
        addProductToWishlist
    )
    .get(
        getLoggedUserWishlist
    )
router
    .route('/:productId')
    .delete(
        removeFromWishlistValidator,
        removeProductToWishlist
    )

module.exports = router;