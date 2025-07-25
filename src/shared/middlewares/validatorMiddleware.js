const { validationResult } = require('express-validator');

exports.validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            value: err.value,
            location: err.location,
            message: err.msg
        }));

        return res.status(400).json({
            status: "fail",
            errors: formattedErrors
        });
    }
    next();
};

