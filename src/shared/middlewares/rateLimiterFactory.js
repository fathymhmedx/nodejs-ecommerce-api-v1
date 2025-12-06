const rateLimit = require('express-rate-limit');

function rateLimiterFactory({ windowMs, max, message }) {
    return rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            const now = Date.now();
            const resetTime = req.rateLimit.resetTime?.getTime() || now;
            const retryAfterMs = resetTime - now;

            res.set('Retry-After', Math.ceil(retryAfterMs / 1000));

            const minutes = Math.floor(retryAfterMs / 60000);
            const seconds = Math.floor((retryAfterMs % 60000) / 1000);

            res.status(429).json({
                status: 'fail',
                message: `${message} Try again in ${minutes}m ${seconds}s`,
                retryAfter: {
                    minutes,
                    seconds,
                    formatted: `${minutes}m ${seconds}s`
                }
            });
        }
    });
}

module.exports = rateLimiterFactory;