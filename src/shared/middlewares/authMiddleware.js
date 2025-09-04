const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

/** @type {import('mongoose').Model} */
const User = require('../../modules/user/user.model');
const ApiError = require('../../shared/errors/ApiError');

/**
 * @route   protect middleware
 * @desc    Protect routes by verifying JWT, checking user existence and password change
 * @access  Private
 */
exports.protect = asyncHandler(async (req, res, next) => {
    // 1) Check if token exist and if exist get it
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ApiError('You are not logged in. Please login to access this route', 401));
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


/**
 * @middleware authorizeRoles
 * @desc    Allow access only to users with specific roles
 * @access  Private
 *
 * @param {...string} roles - Allowed roles (e.g. 'admin', 'manager')
 */
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError('You do not have permission to perform this action', 403)
            );
        }
        next();
    };
};
