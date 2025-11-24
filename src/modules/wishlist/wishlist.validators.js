const { param, body } = require('express-validator');
const { validateRequest } = require('../../shared/middlewares/validatorMiddleware');
const Product = require('../product/product.model');

exports.addToWishlistValidator = [
    body('productId')
        .notEmpty()
        .withMessage("ProductId is required")
        .isMongoId()
        .withMessage("Invalid product id format")
        .custom(async (val) => {
            const product = await Product.findById(val);

            if (!product) {
                throw new Error(`No product found with id: ${val}`);
            }
            return true;
        }),
    validateRequest
];

exports.removeFromWishlistValidator = [
    param('productId')
        .isMongoId().withMessage('Invalid product id format'),
    validateRequest
];