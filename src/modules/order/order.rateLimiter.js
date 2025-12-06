const rateLimiterFactory = require('../../shared/middlewares/rateLimiterFactory');

// POST /orders/:cartId => create cash order
exports.orderLimiter = rateLimiterFactory({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many order attempts,'
});

// GET /orders/checkout-session/:cartId => stripe checkout session
exports.checkoutLimiter = rateLimiterFactory({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many checkout session requests,'
});
