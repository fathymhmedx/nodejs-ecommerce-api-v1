const { param, body } = require('express-validator');
const { validateRequest } = require('../../shared/middlewares/validatorMiddleware');

exports.createCategoryValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3 })
        .withMessage('Category name must be at least 3 characters long')
        .isLength({ max: 32 })
        .withMessage('Category name must not exceed 32 characters'),
    validateRequest
]

const idValidator = param('id')
    .isMongoId()
    .withMessage('Invalid Category ID format');


exports.getCategoryValidator = [idValidator, validateRequest];

exports.updateCategoryValidator = [idValidator, validateRequest];

exports.deleteCategoryValidator = [idValidator, validateRequest];

