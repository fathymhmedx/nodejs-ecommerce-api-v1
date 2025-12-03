const { body, param } = require('express-validator');
const { validateRequest } = require('../../shared/middlewares/validatorMiddleware');

exports.addProductToCartValidator = [
    body('productId')
        .notEmpty().withMessage('Product ID is required')
        .isMongoId().withMessage('Invalid Product ID'),
    body('color')
        .optional()
        .isString().withMessage('Color must be a string'),
    body('quantity')
        .optional()
        .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    validateRequest
];

exports.updateCartItemQuantityValidator = [
    param('itemId')
        .notEmpty().withMessage('Cart item ID is required')
        .isMongoId().withMessage('Invalid cart item ID'),
    body('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    validateRequest
];

exports.removeCartItemValidator = [
    param('itemId')
        .notEmpty().withMessage('Cart item ID is required')
        .isMongoId().withMessage('Invalid cart item ID'),
    validateRequest
];

exports.applyCouponValidator = [
    body('couponName')
        .notEmpty().withMessage('Coupon name is required')
        .isString().withMessage('Coupon name must be a string')
        .trim()
        .isLength({ min: 3, max: 30 }).withMessage('Coupon name length must be between 1 and 50'),
    validateRequest
];
