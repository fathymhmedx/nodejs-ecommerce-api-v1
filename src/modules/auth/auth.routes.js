const express = require('express');
const router = express.Router();

const { signup, login, forgotPassword, verifyResetCode, resetPassword } = require('../auth/auth.controller')
const { signupValidator, loginValidator } = require('../auth/auth.validators')
const { loginLimiter } = require('../../shared/middlewares/rateLimiter');

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
    .route('/forgot-password')
    .post(
        forgotPassword
    )

router
    .route('/verify-reset-code')
    .post(
        verifyResetCode
    )
router
    .route('/reset-password')
    .post(
        resetPassword
    )


module.exports = router;