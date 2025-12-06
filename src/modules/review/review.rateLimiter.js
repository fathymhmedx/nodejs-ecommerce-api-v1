const rateLimiterFactory = require('../../shared/middlewares/rateLimiterFactory');

exports.createReviewLimiter = rateLimiterFactory({
    windowMs: 15 * 60 * 1000, 
    max: 5,
    message: 'Too many reviews created in a short time,'
});

exports.updateReviewLimiter = rateLimiterFactory({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many updates on reviews,'
});

exports.deleteReviewLimiter = rateLimiterFactory({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many delete actions on reviews,'
});
