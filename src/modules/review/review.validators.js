const { param, body } = require('express-validator');
const { validateRequest } = require('../../shared/middlewares/validatorMiddleware');

/** @type {import('mongoose').Model} */
const Review = require('./review.model');
const Product = require('../product/product.model');

exports.createReviewValidator = [
    body('title')
        .optional()
        .trim(),

    body('ratings')
        .notEmpty()
        .withMessage('Ratings value is required')
        .isFloat({
            min: 1,
            max: 5
        })
        .withMessage('Ratings value must be between 1 to 5'),

    body('user')
        .notEmpty()
        .withMessage('Review must belong to a user')
        .isMongoId()
        .withMessage('Invalid review id format'),

    body('product')
        .notEmpty()
        .withMessage('Review must belong to a product')
        .isMongoId()
        .withMessage('Invalid review id format')
        .custom(async (val, { req }) => {
            // Check if product exists
            const prodcut = await Product.findById(val);
            if (!prodcut) {
                throw new Error(`No product found with id: ${val}`);
            }
            // Check if logged user already created review
            const existingReview = await Review.findOne({
                user: req.user._id,
                product: val
            });

            if (existingReview) {
                throw new Error('You already created a review befor');
            }
            return true;
        }),

    validateRequest
]

exports.getReviewValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid user ID format'),
];


exports.updateReviewValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid review ID format')
        .custom(async (val, { req }) => {

            // Check review ownership before update
            const review = await Review.findById(val);

            if (!review) {
                throw new Error(`There is no review with this id: ${val}`);
            }

            // Check ownership
            if (review.user._id.toString() !== req.user._id.toString()) {
                throw new Error('You are not allowed to perform this action');
            }
            return true;

        }),

    validateRequest
];

exports.deleteReviewValidator = [
    param('id')
        .isMongoId()
        .withMessage('Invalid review ID format')
        .custom(async (val, { req }) => {
            if (req.user.role === 'user') {
                // Check review ownership before update
                const review = await Review.findById(val);

                if (!review) {
                    throw new Error(`There is no review with this id: ${val}`);
                }

                // Check ownership
                if (review.user._id.toString() !== req.user._id.toString()) {
                    throw new Error('You are not allowed to perform this action');
                }
            }
            return true;

        }),

    validateRequest
];