// Controls requests and responses
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

/** @type {import('mongoose').Model} */
const User = require('../user/user.model');
const ApiError = require('../../shared/errors/ApiError');

const generateToken = (payload) => {
    return jwt.sign(
        { userId: payload },
        process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
        algorithm: 'HS256'
    })
};

/**
 * @route   POST /api/v1/auth/signup
 * @desc    signup
 * @access  public
 */
exports.signup = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Create user
    const user = await User.create({ name, email, password });

    // Generate token
    const token = generateToken(user._id);

    // Response
    res.status(201).json({
        status: 'success',
        data: {
            user,
            token
        }
    })

});

/**
 * @route   POST /api/v1/auth/login
 * @desc    login
 * @access  public
 */
exports.login = asyncHandler(async (req, res, next) => {
    // check if user exsit & check if password is correct
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new ApiError('Incorrect email or password', 401));

    const isMatch = await user.comparePassword(password)
    if (!isMatch) return next(new ApiError('Incorrect email or password', 401));

    // Extra safety (even with select: false): hide password before response
    user.password = undefined;

    // Generate token 
    const token = generateToken(user._id);

    // Respnose 
    res.status(200).json({
        status: 'success',
        data: {
            user,
            token
        }
    })
});

exports.protect = asyncHandler(async (req, res, next) => {
    // 1) Check if token exist and if exist get it
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ApiError('Not authenticated', 401));
    }
    // 2) verify token (No change happens, expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);


    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.userId).select('+passwordChangedAt');
    if (!currentUser) {
        return next(new ApiError('The user no longer exists', 401));
    }



    // 4) Check if user change his password after token created
    if (currentUser.passwordChangedAt) {
        const passChangedTimestamp = parseInt(
            currentUser.passwordChangedAt.getTime() / 1000, 10
        );

        // Password changed after token created (ERROR)
        if (passChangedTimestamp > decoded.iat) {
            return next(new ApiError('Password changed recently, please login again', 401));
        }
    }

    // 5) Store the current user in req.user so next middlewares/controllers can access it
    req.user = currentUser;

    next();
});
