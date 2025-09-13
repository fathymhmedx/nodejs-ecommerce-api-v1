const express = require('express');
const router = express.Router();

const { signup, login, forgotPassword, verifyResetCode, resetPassword, refreshToken, logout } = require('../auth/auth.controller')
const { signupValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator, verifyResetCodeValidator } = require('../auth/auth.validators')
const { loginLimiter } = require('../../shared/middlewares/rateLimiter');
const { protect } = require('../../shared/middlewares/authMiddleware')
router
    .route('/signup')
    .post(
        signupValidator,
        signup
    )
router
    .route('/login')
    .post(
        loginLimiter,
        loginValidator,
        login
    )

router
    .route('/password/forgot')
    .post(
        forgotPasswordValidator,
        forgotPassword
    )

router
    .route('/password/verify')
    .post(
        verifyResetCodeValidator,
        verifyResetCode
    )
router
    .route('/password/reset')
    .post(
        resetPasswordValidator,
        resetPassword
    )

router
    .route('/refresh-token')
    .get(
        refreshToken
    )
router
    .route('/logout')
    .post(
        protect,
        logout
    )


module.exports = router;