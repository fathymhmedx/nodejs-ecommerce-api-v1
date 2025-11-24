const asyncHandler = require('express-async-handler');

/** @type {import('mongoose').Model} */
const User = require('../user.model');
const ApiError = require('../../../shared/errors/ApiError');

/**
 * @route   POST /api/v1/addresses
 * @desc    Add addresses to user addresses list
 */
const MAX_ADDRESSES = 5;
exports.addaddress = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user._id);

    if (!user) return next(new ApiError("User not found", 404));

    if (user.addresses.length >= MAX_ADDRESSES) {
        return next(new ApiError(`You can only add up to ${MAX_ADDRESSES} addresses.`, 400));
    }

    // $addToSet: add address object to user addresses array if address not exist
    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { addresses: req.body }
    }, {
        new: true,
        runValidators: true,
    });


    res.status(200).json({
        status: "success",
        message: "address added successfully.",
        data: {
            addresses: updatedUser.addresses,
        }
    })
});

/**
 * @route   DELETE /api/v1/addresses/:addressId
 * @desc    Remove address from user addresses list
 */
exports.removeAddress = asyncHandler(async (req, res, next) => {
    // $pull: Remove address object from user addresses array if addressId exist
    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: { addresses: { _id: req.params.addressId } }
    }, {
        new: true,
        runValidators: true,
    });

    if (!user) return next(new ApiError("User not found", 404));

    res.status(200).json({
        status: "success",
        message: "Address removed successfully.",
        data: {
            addresses: user.addresses,
        }
    })
});


/**
 * @route   GET /api/v1/addresses
 * @desc    Get logged user addresses
 */
exports.getLoggedUseraddresses = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        status: "success",
        results: user.addresses.length,
        data: {
            addresses: user.addresses,
        }
    })

});