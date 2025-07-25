const { body, param } = require('express-validator');
const { validateRequest } = require('../../shared/middlewares/validatorMiddleware');

exports.createBrandValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Brand name is required')
        .isLength({ min: 3 })
        .withMessage('Brand name must be at least 3 characters long')
        .isLength({ max: 32 })
        .withMessage('Brand name must not exceed 32 characters'),
    validateRequest
]

exports.getBrandValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid brand id format'),
    validateRequest
]

exports.updateBrandValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid brand id format'),
    validateRequest
]

exports.deleteBrandValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid brand id format'),
    validateRequest
]