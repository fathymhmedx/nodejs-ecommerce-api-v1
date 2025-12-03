const asyncHandler = require('express-async-handler');

/**@type {import('mongoose').Model} */
const Cart = require('./cart.model');
/**@type {import('mongoose').Model} */
const Product = require('../product/product.model');
/**@type {import('mongoose').Model} */
const Coupon = require('../coupon/coupon.model');
const ApiError = require('../../shared/errors/ApiError');

/**
 * @route   POST /api/v1/cart
 * @desc    Add Product to shopping cart
 * @access  protected (user)
 */
exports.addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, color } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) return next(new ApiError("Product not found", 404));

    // 1) Get cart for logged user.
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        // create cart fo logged user with product
        cart = await Cart.create({
            user: req.user._id,
            cartItems: [{
                product: productId,
                color,
                price: product.price,
                quantity: 1
            }]
        });
    } else {
        // Product exsit in cart, then update quantity.
        const prodcutIndex = cart.cartItems.findIndex(
            (item) => item.product.toString() === productId && item.color === color
        );

        if (prodcutIndex > -1) {
            cart.cartItems[prodcutIndex].quantity += 1;

        } else {
            //Product not exist in cart,  Push prodcut to cartItems array
            cart.cartItems.push({
                product: productId,
                color,
                price: product.price,
                quantity: 1
            });
        }
    }

    cart.calculateTotalPrice();

    await cart.save();

    res.status(201).json({
        status: "success",
        results: cart.cartItems.length,
        message: "Product added to cart successfully",
        data: {
            cart
        }
    })
});

/**
 * @route   GET /api/v1/cart
 * @desc    Get Logged User Shopping card
 * @access  protected (user)
 */
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new ApiError("Cart not found for this user", 404));
    }

    res.status(200).json({
        status: "success",
        results: cart.cartItems.length,
        data: {
            cart
        }
    })
});

/**
 * @route   DELETE /api/v1/cart/:itemId
 * @desc    Remove specific item from logged user's cart
 * @access  protected (user)
 */
exports.removeCartItem = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new ApiError('Cart not found for this user', 404));
    }

    const item = cart.cartItems.id(req.params.itemId);
    if (!item) {
        return next(new ApiError(`No cart item found with id: ${req.params.itemId}`, 404));
    }
    item.deleteOne();

    cart.calculateTotalPrice();
    await cart.save();

    res.status(200).json({
        status: "success",
        results: cart.cartItems.length,
        data: {
            cart
        }
    });
});

/**
 * @route   PUT /api/v1/cart/:itemId
 * @desc    Update specipic cart item quantity
 * @access  protected (user)
 */
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new ApiError("Cart not found for this user", 404));
    }

    const itemIndex = cart.cartItems.findIndex((item) => item._id.toString() === req.params.itemId);

    if (itemIndex === -1) {
        return next(new ApiError(`No cart item found with id: ${req.params.itemId}`, 404));
    }

    cart.cartItems[itemIndex].quantity = quantity;

    cart.calculateTotalPrice();
    await cart.save();

    res.status(200).json({
        status: "success",
        results: cart.cartItems.length,
        data: {
            cart
        }
    })
});


/**
 * @route   DELETE /api/v1/cart/clear
 * @desc    Clear all items from logged user's cart
 * @access  protected (user)
 */
exports.clearCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndDelete({ user: req.user._id });
    if (!cart) {
        return next(new ApiError('Cart not found for this user', 404));
    }

    res.status(200).json({
        status: "success",
        message: "Cart cleared successfully",
    });
});

/**
 * @route   PUT /api/v1/cart/apply-coupon
 * @desc    Apply coupon to cart
 * @access  protected (user)
 */
exports.applyCoupon = asyncHandler(async (req, res, next) => {
    const { couponName } = req.body;
    // 1) Get Cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new ApiError("Cart not found for this user", 404));
    }

    // 2) Get coupon based on name(Unique) and expireTime
    const coupon = await Coupon.findOne({
        name: couponName,
        expire: { $gt: Date.now() },
        isActive: true
    });
    if (!coupon) {
        return next(new ApiError("Invalid, expired, or inactive coupon", 404));
    }

    // 3) Discount Calculation
    const discountAmount = (cart.totalCartPrice * coupon.discount) / 100;
    cart.totalPriceAfterDiscount = cart.totalCartPrice - discountAmount;

    cart.isDiscountApplied = true;

    await cart.save();

    res.status(200).json({
        status: "success",
        message: `Coupon applied successfully! You saved ${discountAmount}`,
        data: {
            cart
        }
    });
});