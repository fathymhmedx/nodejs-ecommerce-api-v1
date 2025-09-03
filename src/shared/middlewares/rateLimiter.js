const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 10, // Max 10 attempts
    standardHeaders: true, //Returns headers like (RateLimit-Remaining, RateLimit-Reset)
    legacyHeaders: false,  // Stops old X-RateLimit-* headers
    handler: (req, res) => {
        const now = Date.now();
        const resetTime = req.rateLimit.resetTime?.getTime() || now;
        const retryAfterMs = resetTime - now;

        res.set('Retry-After', Math.ceil(retryAfterMs / 1000));

        const minutes = Math.floor(retryAfterMs / 60000);
        const seconds = Math.floor((retryAfterMs % 60000) / 1000);

        res.status(429).json({
            status: 'fail',
            message: `Too many login attempts. Try again in ${minutes}m ${seconds}s`, // Seconds remaining
            retryAfter: {
                minutes,
                seconds,
                formatted: `${minutes}m ${seconds}s`
            }
        });
    }
});
