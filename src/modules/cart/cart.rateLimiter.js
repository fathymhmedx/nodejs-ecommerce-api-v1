const rateLimiterFactory = require('../../shared/middlewares/rateLimiterFactory');

// POST /api/v1/cart
exports.addProductLimiter = rateLimiterFactory({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many attempts to add products to cart,'
});

// DELETE /api/v1/cart/clear
exports.clearCartLimiter = rateLimiterFactory({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many attempts to clear your cart,'
});

// PUT /api/v1/cart/apply-coupon
exports.applyCouponLimiter = rateLimiterFactory({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: 'Too many attempts to apply coupons,'
});

// PUT /api/v1/cart/:itemId
exports.updateCartItemLimiter = rateLimiterFactory({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many attempts to update cart items,'
});

// DELETE /api/v1/cart/:itemId
exports.removeCartItemLimiter = rateLimiterFactory({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many attempts to remove items from cart,'
});
