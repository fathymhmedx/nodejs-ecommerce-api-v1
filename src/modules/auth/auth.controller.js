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
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}
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

})

exports.login = asyncHandler(async (req, res, next) => {
    // check if user exsit & check if password is correct
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new ApiError('Incorrect email or password', 401));

    const isMatch = await bcrypt.compare(password, user.password);
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
})