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

const idValidator = param('id')
    .isMongoId()
    .withMessage('Invalid Brand ID format');



exports.getBrandValidator = [idValidator, validateRequest];

exports.updateBrandValidator = [idValidator, validateRequest];

exports.deleteBrandValidator = [idValidator, validateRequest];