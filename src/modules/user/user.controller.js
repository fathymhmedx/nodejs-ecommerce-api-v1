// Controls requests and responses
const asyncHandler = require('express-async-handler');

/** @type {import('mongoose').Model} */
const User = require('../user/user.model');
const ApiError = require('../../shared/errors/ApiError');
const factory = require('../../shared/utils/handlers/handlerFactory');
const { uploadSingleImage, resizeAndSaveSingleImage } = require('../../shared/middlewares/uploadImageMiddleware');
const { generateTokens, setRefreshCookie } = require('../../shared/utils/auth.utils');

exports.uploadUserImage = uploadSingleImage('profileImage');

exports.resizeAndSaveSingleImage = resizeAndSaveSingleImage('users', 'profileImage', 600, 600);
/**
 * @route   POST /api/v1/users
 * @desc    Create new user
 * @access  private
 */
exports.createUser = factory.createOne(User);

/**
 * @route   GET /api/v1/users
 * @desc    Get list of Users
 * @access  private
 */
exports.getUsers = factory.getAll(User);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get a specific User by ID
 * @access  private
 */
exports.getUser = factory.getOne(User);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    update a specific User by ID
 * @access  private
 */

exports.updateUser = factory.updateOne(User);

/**
 * @route   PUT /api/v1/users/:id/password
 * @desc    Update user password
 * @access  private
 */
exports.changePassword = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { password } = req.body

    // 1) Find the user by ID, include password field for hashing
    const user = await User.findById(id).select('+password');
    if (!user) {
        return next(new ApiError(`No user found for id: ${id}`, 404));
    }

    // 2) Update user's password (pre-save hook will hash it and set passwordChangedAt)
    user.password = password;
    await user.save();

    // 3) Response
    res.status(200).json({
        status: 'success',
        message: 'Password updated successfully',
    })
});

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete a specific User by ID
 * @access  private
 */
exports.deleteUser = factory.deleteOne(User);


/**
 * @route   GET /api/v1/users/getMe
 * @desc    Get logged user data
 * @access  private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;

    next();
});

/**
 * @route   PUT /api/v1/users/me/password
 * @desc    Update logged user password
 * @access  private
 */
exports.updateMyPassword = asyncHandler(async (req, res, next) => {
    // 1) Get user from req.user (set by protect)
    const { _id } = req.user;
    const { currentPassword, password } = req.body;
    const user = await User.findById(_id).select('+password');

    if (!user) {
        return next(new ApiError(`No user found for id: ${req.user._id}`, 404));
    }

    // 2) Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        return next(new ApiError('Current password is incorrect', 401));
    }

    // 3) Update password and save (pre-save will hash + set passwordChangedAt)
    user.password = password;
    await user.save();

    // 4) Generate new tokens (invalidate old tokens by using passwordChangedAt)
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

    // 5) Set refresh token cookie again
    setRefreshCookie(res, newRefreshToken);

    // 6) Explicitly remove password and passwordChangedAt before sending response (extra safety)
    user.password = undefined;
    user.passwordChangedAt = undefined;
    // 7) Response
    res.status(200).json({
        status: 'success',
        data: {
            user
        },
        accessToken
    })

});

/**
 * @route   PUT /api/v1/users/me
 * @desc    Update logged user data (Without password, role)
 * @access  private
 */

exports.updateMe = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const { name, email, phone, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(_id, {
        name, email, phone, profileImage
    }, {
        runValidators: true,
        new: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })

});

/**
 * @route   PUT /api/v1/users/me/deactivate
 * @desc    Deactivate logged-in user's account
 * @access  Private (Logged-in user)
 */
exports.deactivateMyAccount = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
        return next(new ApiError(`No user found for id: ${req.user._id}`, 404));
    }

    user.active = false;
    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'Your account has been deactivated. You can reactivate by logging in again.',
    });
});

/**
 * @route   PUT /api/v1/users/:id/deactivate
 * @desc    Admin deactivate any user account
 * @access  Private (Admin only)
 */
exports.deactivateUserByAdmin = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        return next(new ApiError(`No user found for id: ${id}`, 404));
    }

    user.active = false;
    await user.save();

    res.status(200).json({
        status: 'success',
        message: `User ${user.name}'s account has been deactivated.`,
    });
});

/**
 * @route   PUT /api/v1/users/:id/reactivate
 * @desc    Admin reactivate any user account
 * @access  Private (Admin only)
 */
exports.reactivateUserByAdmin = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        return next(new ApiError(`No user found for id: ${id}`, 404));
    }

    user.active = true;
    await user.save();

    res.status(200).json({
        status: 'success',
        message: `User ${user.name}'s account has been reactivated.`,
        data: {
            user
        }
    });
});
