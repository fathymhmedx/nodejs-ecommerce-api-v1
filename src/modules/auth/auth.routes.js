const express = require('express');
const router = express.Router();

const { signup, login, forgotPassword, verifyResetCode, resetPassword, refreshToken } = require('../auth/auth.controller')
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
    .route('/password/forgot')
    .post(
        forgotPassword
    )

router
    .route('/password/verify')
    .post(
        verifyResetCode
    )
router
    .route('/password/reset')
    .post(
        resetPassword
    )

router
    .route('/refresh-token')
    .get(
        refreshToken
    )


module.exports = router;