const { body, param } = require('express-validator');
const { validateRequest } = require('../../shared/middlewares/validatorMiddleware');

/** @type {import('mongoose').Model} */
const Coupon = require('./coupon.model');

exports.createCouponValidator = [
    body('name')
        .notEmpty().withMessage('Coupon name is required')
        .isString().withMessage('Coupon name must be a string')
        .trim()
        .isLength({ min: 3, max: 30 }).withMessage('Coupon name length must be between 1 and 50')
        .custom(async (value) => {
            const existing = await Coupon.findOne({ name: value });
            if (existing) {
                throw new Error('Coupon name already exists');
            }
            return true;
        }),

    body('expire')
        .notEmpty().withMessage('Expiry date is required')
        .isISO8601().withMessage('Expiry date must be a valid date')
        .custom((value) => {
            const expireDate = new Date(value);
            if (expireDate <= new Date()) {
                throw new Error('Expiry date must be in the future');
            }
            return true;
        }),
    body('discount')
        .notEmpty().withMessage('Discount is required')
        .isFloat({ min: 1, max: 100 }).withMessage('Discount must be between 1 and 100'),
    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean'),
    validateRequest
];

exports.updateCouponValidator = [
    body('name')
        .optional()
        .isString().withMessage('Coupon name must be a string'),
    body('expire')
        .optional()
        .isISO8601().withMessage('Expiry date must be a valid date')
        .custom((value) => {
            const expireDate = new Date(value);
            if (expireDate <= new Date()) {
                throw new Error('Expiry date must be in the future');
            }
            return true;
        }),
    body('discount')
        .optional()
        .isFloat({ min: 1, max: 100 }).withMessage('Discount must be between 1 and 100'),
    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean'),
    validateRequest
];

// Validate ID for GET, DELETE, Activate, Deactivate 
exports.couponIdValidator = [
    param('id')
        .notEmpty().withMessage('Coupon ID is required')
        .isMongoId().withMessage('Invalid Coupon ID'),
    validateRequest
];
