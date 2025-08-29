const { param, body } = require('express-validator');
const { validateRequest } = require('../../shared/middlewares/validatorMiddleware');

exports.createSubCategoryValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('SubCategory name is required')
        .isLength({ min: 3 }).withMessage('SubCategory name must be at least 3 characters long')
        .isLength({ max: 32 }).withMessage('SubCategory name must not exceed 32 characters'),

    body('category')
        .notEmpty().withMessage('SubCategory must belong to a category')
        .isMongoId().withMessage('Invalid category id format'),

    validateRequest
];


const idValidator = param('id')
    .isMongoId()
    .withMessage('Invalid subCategory ID format');


exports.getSubCategoryValidator = [idValidator, validateRequest];

exports.updateSubCategoryValidator = [idValidator, validateRequest];

exports.deleteSubCategoryValidator = [idValidator, validateRequest];