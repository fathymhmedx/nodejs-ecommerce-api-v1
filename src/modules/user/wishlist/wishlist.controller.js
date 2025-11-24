const asyncHandler = require('express-async-handler');

/** @type {import('mongoose').Model} */
const User = require('../user.model');
const ApiError = require('../../../shared/errors/ApiError');

/**
 * @route   POST /api/v1/wishlist
 * @desc    Add product to wishlist
 */
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
    // $addToSet: add productId to wishlist array if productId not exist
    const user = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { wishlist: req.body.productId }
    }, {
        new: true,
        runValidators: true,
    });

    if (!user) return next(new ApiError("User not found", 404));

    res.status(200).json({
        status: "success",
        message: "Product added successfully to your wishlist",
        data: {
            wishlist: user.wishlist,
        }
    })
});

/**
 * @route   DELETE /api/v1/wishlist/:id
 * @desc    Remove product from wishlist
 */
exports.removeProductToWishlist = asyncHandler(async (req, res, next) => {
    // $pull: Remove productId from wishlist array if productId exist
    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: { wishlist: req.params.productId }
    }, {
        new: true,
        runValidators: true,
    });

    if (!user) return next(new ApiError("User not found", 404));

    res.status(200).json({
        status: "success",
        message: "Product removed successfully from your wishlist",
        data: {
            wishlist: user.wishlist,
        }
    })
});


/**
 * @route   GET /api/v1/wishlist
 * @desc    Get logged user wishlist
 */
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id)
        .populate('wishlist', 'title price imageCover ratingsAverage');

    res.status(200).json({
        status: "success",
        results: user.wishlist.length,
        data: {
            wishlist: user.wishlist
        }
    })

});