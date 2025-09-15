const express = require('express');
const router = express.Router();

const { uploadUserImage, resizeAndSaveSingleImage, createUser, getUsers, getUser, updateUser, changePassword, deleteUser, getMe, updateMyPassword, updateMe, deactivateUserByAdmin, deactivateMyAccount, reactivateUserByAdmin } = require('./user.controller');
const { createUserByAdminValidator, getUserByAdminValidator, updateUserByAdminValidator, deleteUserByAdminValidator, updateUserPasswordByAdminValidator, updateLoggedUserPasswordValidator, updateLoggedUserValidator, deactivateUserByAdminValidator, reactivateUserByAdminValidator } = require('./user.validators')
const { protect, authorizeRoles } = require('../../shared/middlewares/authMiddleware');


// Apply authentication middleware to all routes
router.use(protect);

/**
 * @route   GET /api/v1/users/me
 * @desc    Get logged-in user profile
 * @access  private (Logged-in user)
 */
router
    .route('/me')
    .get(
        getMe,
        getUser
    )
    .put(
        uploadUserImage,
        resizeAndSaveSingleImage,
        updateLoggedUserValidator,
        updateMe
    )
/**
 * @route   PUT /api/v1/users/me/password
 * @desc    Update logged-in user password
 * @access  private (Logged-in user)
 */
router
    .route('/me/password')
    .put(
        updateLoggedUserPasswordValidator,
        updateMyPassword
    )

/**
 * @route   PUT /api/v1/users/me/deactivate
 * @desc    Deactivate logged-in user's account
 * @access  private (Logged-in user)
 */
router
    .route('/me/deactivate')
    .put(
        deactivateMyAccount
    );

/**
 * @route   PUT /api/v1/users/:id/deactivate
 * @desc    Admin deactivate any user account
 * @access  private (Admin only)
 */
router
    .route('/:id/deactivate')
    .put(
        authorizeRoles('admin'),
        deactivateUserByAdminValidator,
        deactivateUserByAdmin
    );
/**
 * @route   PUT /api/v1/users/:id/reactivate
 * @desc    Admin can reactivate any user's account
 * @access  private (Admin only)
 */
router
    .route('/:id/reactivate')
    .put(
        authorizeRoles('admin'),
        reactivateUserByAdminValidator,
        reactivateUserByAdmin
    );

/**
 * @route   PUT /api/v1/users/:id/password
 * @desc    Admin change user password
 * @access  private (Admin only)
 */
router
    .route('/:id/password')
    .put(
        authorizeRoles('admin'),
        updateUserPasswordByAdminValidator,
        changePassword
    )

/**
 * @route   GET /api/v1/users
 * @desc    Get all users
 * @access  private (Admin, Manager)
 */
router
    .route('/')
    .get(
        authorizeRoles('admin', 'manager'),
        getUsers
    )
    /**
     * @route   POST /api/v1/users
     * @desc    Create a new user
     * @access  private (Admin only)
     */
    .post(
        authorizeRoles('admin'),
        uploadUserImage,
        resizeAndSaveSingleImage,
        createUserByAdminValidator,
        createUser
    )

/**
* @route   /api/v1/users/:id
* @desc    Get / Update / Delete user by ID
* @access  private (Admin only)
*/
router
    .route('/:id')
    .get(
        authorizeRoles('admin'),
        getUserByAdminValidator,
        getUser
    )
    .put(
        authorizeRoles('admin'),
        uploadUserImage,
        resizeAndSaveSingleImage,
        updateUserByAdminValidator,
        updateUser
    )
    .delete(
        authorizeRoles('admin'),
        deleteUserByAdminValidator,
        deleteUser
    )

module.exports = router;