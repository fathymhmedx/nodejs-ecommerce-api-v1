const rateLimiterFactory = require('../../../shared/middlewares/rateLimiterFactory');

exports.addToWishlistLimiter = rateLimiterFactory({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many requests to add products to wishlist,'
});

exports.removeFromWishlistLimiter = rateLimiterFactory({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many requests to remove products from wishlist,'
});
