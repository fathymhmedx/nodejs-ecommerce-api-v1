const { param, body } = require('express-validator');
const { validateRequest } = require('../middlewares/validatorMiddleware');

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
exports.getCategoryValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid category id format'),
    validateRequest
]
exports.updateCategoryValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid category id format'),
    validateRequest
]

exports.deleteCategoryValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid category id format'),
    validateRequest
]

