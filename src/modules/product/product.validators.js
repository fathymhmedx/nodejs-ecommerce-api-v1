const { body, param } = require('express-validator')
const { validateRequest } = require('../../shared/middlewares/validatorMiddleware');
const Category = require('../models/categoryModel');
const SubCategory = require('../models/subCategoryModel');
const validatePriceDiscount = (value, { req }) => {
    if (value >= req.body.price) {
        throw new Error('priceAfterDiscount must be lower than price');
    }
    return true;
};

exports.createProductValidator = [
    body('title')
        .notEmpty().withMessage('Product title is required')
        .isString().withMessage('Title must be a string')
        .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),

    body('description')
        .notEmpty().withMessage('Product description is required')
        .isString().withMessage('Title must be a string')
        .isLength({ min: 20 }).withMessage('Product description must be at least 20 characters long'),

    body('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),

    body('sold')
        .optional()
        .isInt({ min: 0 }).withMessage('Sold must be a non-negative integer'),

    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),

    body('priceAfterDiscount')
        .optional()
        .isFloat({ min: 0 }).withMessage('priceAfterDiscount must be a number')
        .custom(validatePriceDiscount),

    body('colors')
        .optional({ checkFalsy: true })
        .isArray().withMessage('Colors must be an array'),

    body('colors.*')
        .optional()
        .isString().withMessage('Each color must be a string'),

    body('images')
        .optional()
        .isArray().withMessage('Images must be an array'),

    body('images.*')
        .optional()
        .isString().withMessage('Each image must be a string'),

    body('imageCover')
        .notEmpty().withMessage('Cover image is required')
        .isString().withMessage('Cover image must be a string'),

    body('category')
        .notEmpty().withMessage('Category is required')
        .isMongoId().withMessage('Invalid category ID format')
        .custom(async (categoryId) => {
            const category = await Category.findById(categoryId);
            if (!category) {
                throw new Error(`No category found for this ID: ${categoryId}`);
            }
            return true;
        }),

    body('subCategories')
        .optional()
        .isArray().withMessage('subCategories must be an array'),
    body('subCategories.*')
        .optional()
        .isMongoId().withMessage('Each subCategories ID must be valid'),
    body('subCategories')
        .optional()
        .custom(async (val, { req }) => {
            if (!Array.isArray(val)) {
                throw new Error('subCategories must be an array');
            }

            if (!req.body.category) {
                throw new Error('Category is required for subCategory validation');
            }

            // Get all subCategories associated with the category
            const subcategories = await SubCategory.find({ category: req.body.category });

            // Convert IDs to an array of Strings
            const subCategoriesIdsInDB = subcategories.map(sub => sub._id.toString());

            // Check that each element in val is within the IDs we got
            const allBelong = val.every(v => subCategoriesIdsInDB.includes(v));
            if (!allBelong) {
                throw new Error('Some subCategories do not belong to the specified category');
            }

            return true;
        }),
    body('brand')
        .optional()
        .isMongoId().withMessage('Brand must be a valid Mongo ID'),

    body('ratingsAverage')
        .optional()
        .isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1.0 and 5.0'),

    body('ratingQuantity')
        .optional()
        .isInt({ min: 0 }).withMessage('Rating quantity must be a non-negative integer'),
    validateRequest
];


exports.getProductValidator = [
    param('id').isMongoId().withMessage('Inavlid ID format'),
    validateRequest
]

exports.updateProductValidator = [
    param('id').isMongoId().withMessage('Inavlid ID format'),
    validateRequest
]

exports.deleteProductValidator = [
    param('id').isMongoId().withMessage('Inavlid ID format'),
    validateRequest
]

