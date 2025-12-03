const express = require('express');
const router = express.Router();

const { addProductToCart, getLoggedUserCart, removeCartItem, clearCart, updateCartItemQuantity, applyCoupon } = require('./cart.controller');
const { addProductToCartValidator, updateCartItemQuantityValidator, removeCartItemValidator, applyCouponValidator } = require('./cart.validators');
const { protect, authorizeRoles } = require('../../shared/middlewares/authMiddleware');

router.use(protect, authorizeRoles('user'));

/**
 * @desc Add product to cart & get logged user's cart
 */
router
    .route('/')
    .post(
        addProductToCartValidator,
        addProductToCart
    )
    .get(getLoggedUserCart)

/**
 * @desc  Clear all items in cart
 */
router
    .route('/clear')
    .delete(clearCart)

/**
 * @desc  Apply coupon to cart
*/
router
    .route('/apply-coupon')
    .put(
        applyCouponValidator,
        applyCoupon
    )

/**
 * @desc  Remove specific cart item
 */
router
    .route('/:itemId')
    .put(updateCartItemQuantityValidator,
        updateCartItemQuantity
    )
    .delete(
        removeCartItemValidator,
        removeCartItem
    )

module.exports = router;