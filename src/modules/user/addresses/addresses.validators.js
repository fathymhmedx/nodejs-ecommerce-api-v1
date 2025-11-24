const { body, param } = require('express-validator');
const { validateRequest } = require('../../../shared/middlewares/validatorMiddleware');
exports.addAddressValidator = [
    body('alias')
        .notEmpty().withMessage('Alias is required')
        .isLength({ max: 50 }).withMessage('Alias max length is 50 characters')
        .matches(/^[a-zA-Z0-9 ]+$/).withMessage('Alias must contain only letters, numbers and spaces'),

    body('details')
        .notEmpty().withMessage('Details is required'),

    body('phone')
        .notEmpty().withMessage('Phone is required')
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid phone number, must be Egyptian or Saudi format'),

    body('city')
        .notEmpty().withMessage('City is required'),

    body('postalCode')
        .notEmpty().withMessage('Postal code is required')
        .isPostalCode('EG').withMessage('Postal code must be a valid Egyptian postal code'),
    validateRequest
];


exports.removeAddressValidator = [
    param('addressId')
        .isMongoId().withMessage('Invalid address ID'),
    validateRequest
];
