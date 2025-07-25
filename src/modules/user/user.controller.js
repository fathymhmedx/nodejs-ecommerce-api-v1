/** @type {import('mongoose').Model} */
const User = require('../models/userModel');
const ApiError = require('../utils/errors/ApiError');
const asyncHandler = require('express-async-handler');

exports.CreateUser = asyncHandler(async (req, res, next) => {
    const {
        name,
        email,
        password,
        phone,
        profileImage
    } = req.body;
});