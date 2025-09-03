// Controls requests and responses
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

/** @type {import('mongoose').Model} */
const User = require('../user/user.model');
const ApiError = require('../../shared/errors/ApiError');
const factory = require('../../shared/utils/handlers/handlerFactory');
const { uploadSingleImage, resizeAndSaveSingleImage } = require('../../shared/middlewares/uploadImageMiddleware');


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
 * @route   PUT /api/v1/users/:id/change-password
 * @desc    Update user password
 * @access  private
 */
exports.changePassword = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { currentPassword } = req.body

    const user = await User.findById(id).select('+password');
    if (!user) {
        next(new ApiError(`No user found for id: ${id}`, 404));
    }


    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return next(new ApiError('Current password is incorrect', 401));
    }

    // Save new password && when set new password (passwordChangedAt will update automatically in pre-save hook)

    user.password = req.body.password;

    // pre('save') hook will automatically hash the password
    await user.save();

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


