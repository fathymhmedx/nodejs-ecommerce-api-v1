const rateLimiterFactory = require('../../shared/middlewares/rateLimiterFactory');

// POST /api/v1/auth/signup
exports.signupLimiter = rateLimiterFactory({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Too many signup attempts,'
});

// POST /api/v1/auth/login

exports.loginLimiter = rateLimiterFactory({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many login attempts,'
});

// POST /api/v1/auth/password/forgot
exports.forgotPasswordLimiter = rateLimiterFactory({
    windowMs: 30 * 60 * 1000,
    max: 3,
    message: 'Too many attempts to reset password,'
});

// POST /api/v1/auth/password/verify
exports.verifyResetCodeLimiter = rateLimiterFactory({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many verify attempts,'
});

// POST /api/v1/auth/password/reset
exports.resetPasswordLimiter = rateLimiterFactory({
    windowMs: 30 * 60 * 1000,
    max: 5,
    message: 'Too many password reset attempts,'
});