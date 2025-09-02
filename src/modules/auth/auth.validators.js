const { body } = require('express-validator');
const { validateRequest } = require('../../shared/middlewares/validatorMiddleware');

/** @type {import('mongoose').Model} */
const User = require('../user/user.model');

exports.signupValidator = [
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
        .custom(async (val) => {
            const existingUser = await User.findOne({ email: val });
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
        .custom((val, { req }) => {
            if (val !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    validateRequest
]


exports.loginValidator = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    validateRequest
]


