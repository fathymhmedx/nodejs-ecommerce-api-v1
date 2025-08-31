const { param, body } = require('express-validator');
const { validateRequest } = require('../../shared/middlewares/validatorMiddleware');

/** @type {import('mongoose').Model} */
const User = require('../user/user.model');

exports.createUserValidator = [
    body('name')
        .notEmpty()
        .withMessage('User name is required')
        .trim()
        .isLength({ min: 3 })
        .withMessage('User name must be at least 3 characters long'),

    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail()
        .custom(async (value) => {
            const existingUser = await User.findOne({ email: value });
            if (existingUser) {
                throw new Error('Email already exists');
            }
            return true;
        }),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })
        .withMessage('Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol'),

    body('confirmPassword')
        .notEmpty()
        .withMessage('Confirm password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    body('phone')
        .optional()
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid phone number, must be Egyptian or Saudi format'),

    body('profileImage').optional(),

    body('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either user or admin'),


    validateRequest
]


const idValidator = param('id')
    .isMongoId()
    .withMessage('Invalid user ID format');

exports.getUserValidator = [idValidator, validateRequest];
exports.updateUserValidator = [idValidator, validateRequest];
exports.deleteUserValidator = [idValidator, validateRequest];
