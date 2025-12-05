const { body } = require('express-validator');
const { validateRequest } = require('../../shared/middlewares/validatorMiddleware');

exports.updatePricingSettingsValidator = [
    body('taxPercentage')
        .optional()
        .isNumeric()
        .withMessage('taxPercentage must be a number')
        .custom((value) => value >= 0 && value <= 100)
        .withMessage('taxPercentage must be between 0 and 100'),
    body('shippingPrice')
        .optional()
        .isNumeric().withMessage('shippingPrice must be a number')
        .custom((value) => value >= 0).withMessage('shippingPrice must be >= 0'),
    validateRequest
];
