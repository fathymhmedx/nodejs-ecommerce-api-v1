const express = require('express');
const router = express.Router();

const { signup, login, forgotPassword, verifyResetCode, resetPassword, refreshToken, logout } = require('../auth/auth.controller')
const { signupValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator, verifyResetCodeValidator } = require('../auth/auth.validators')
const { loginLimiter } = require('../../shared/middlewares/rateLimiter');
const { protect } = require('../../shared/middlewares/authMiddleware')

/**
 * @route   POST /api/v1/auth/signup
 * @desc    Create a new user account (signup)
 * @access  Public
 */
router
    .route('/signup')
    .post(
        signupValidator,
        signup
    )

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login a user and issue access & refresh tokens
 * @access  Public
 */
router
    .route('/login')
    .post(
        loginLimiter,
        loginValidator,
        login
    )

/**
 * @route   POST /api/v1/auth/password/forgot
 * @desc    Request password reset code via email
 * @access  Public
 */
router
    .route('/password/forgot')
    .post(
        forgotPasswordValidator,
        forgotPassword
    )

/**
* @route   POST /api/v1/auth/password/verify
* @desc    Verify password reset code
* @access  Public
*/
router
    .route('/password/verify')
    .post(
        verifyResetCodeValidator,
        verifyResetCode
    )

/**
 * @route   POST /api/v1/auth/password/reset
 * @desc    Reset password using verified code
 * @access  Public
 */
router
    .route('/password/reset')
    .post(
        resetPasswordValidator,
        resetPassword
    )

/**
* @route   GET /api/v1/auth/refresh-token
* @desc    Issue a new access token using the refresh token stored in cookies
* @access  Public
*/
router
    .route('/refresh-token')
    .get(
        refreshToken
    )

/**
* @route   POST /api/v1/auth/logout
* @desc    Logout user and clear refresh token cookie
* @access  Private
*/
router
    .route('/logout')
    .post(
        protect,
        logout
    )


module.exports = router;