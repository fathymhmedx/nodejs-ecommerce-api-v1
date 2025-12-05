const { body, param } = require('express-validator');
const { validateRequest } = require('../../shared/middlewares/validatorMiddleware');

exports.createCashOrderValidator = [
    // Validate cartId param
    param('cartId')
        .notEmpty().withMessage('cartId is required')
        .isMongoId().withMessage('cartId must be a valid MongoDB ID'),

    // Validate shippingAddress
    body('shippingAddress').optional(),
    body('shippingAddress.details')
        .optional()
        .isString().withMessage('Shipping address details must be a string'),
    body('shippingAddress.city')
        .optional()
        .isString().withMessage('City must be a string'),
    body('shippingAddress.postalCode')
        .optional()
        .isPostalCode('EG').withMessage('Invalid Egyptian postal code'),
    body('shippingAddress.phone')
        .optional()
        .isMobilePhone(['ar-EG', 'ar-SA']).withMessage('Invalid phone number, must be Egyptian or Saudi format'),
    validateRequest
];

// Generic validator for routes with order ID in params
const orderIdParamValidator = [
    param('id')
        .notEmpty().withMessage('Order ID is required')
        .isMongoId().withMessage('Order ID must be a valid MongoDB ID'),
    validateRequest
];

exports.getLoggedUserOrderByIdValidator = orderIdParamValidator;

exports.updateOrderStatusToPaidValidator = orderIdParamValidator;

exports.updateOrderStatusToDeliveredValidator = orderIdParamValidator;

exports.GetCheckoutSessionValidator = [
    param('cartId')
        .notEmpty().withMessage('cartId is required')
        .isMongoId().withMessage('cartId must be a valid MongoDB ID'),
    validateRequest
];