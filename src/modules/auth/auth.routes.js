const express = require('express');
const router = express.Router();

const { signup, login } = require('../auth/auth.controller')
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

module.exports = router;