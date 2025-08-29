// Controls requests and responses
/** @type {import('mongoose').Model} */
const User = require('../user/user.model');
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
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete a specific User by ID
 * @access  private
 */
exports.deleteUser = factory.deleteOne(User);
