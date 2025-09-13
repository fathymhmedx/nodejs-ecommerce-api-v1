// Controls requests and responses
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');

/** @type {import('mongoose').Model} */
const User = require('../user/user.model');
const ApiError = require('../../shared/errors/ApiError');

const { generateToken } = require('../../shared/utils/generateToken');
const { sendEmail } = require('../../shared/utils/sendEmail');

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

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Forgot password
 * @access  public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // 1) Get user by email
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return next(new ApiError(`There is no user with that email: ${email}`, 404));
    }
    // 2) If user exist, Generate secure 6 digits code 
    const resetCode = crypto.randomInt(100000, 999999).toString();
    
    // 3) Hash the reset code (for security) 
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(resetCode)
        .digest('hex');

    // 4) Save hashed code, 10 min expiry, and mark as unverified
    user.passwordResetCode = hashedResetCode;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetVerified = false;

    await user.save();

    // 3) Send tha reset code via email
    const message = `Hi ${user.name},\n
                     We received a request to reset the password on your ${process.env.EMAIL_FROM_NAME} Account.\n
                     ${resetCode}\n
                     Enter this code to complete the reset.\n
                     Thanks for helping us keep your account secure.
                     The ${process.env.EMAIL_FROM_NAME} team`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset code (Valid for 10 min)',
            message
        })

        res.status(200).json({
            status: 'success',
            message: 'Reset code sent to email'
        })
    } catch (error) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;

        await user.save()
        return next(new ApiError('There was an error sending the email. Try again later.', 500))
    }

});

/**
 * @route   POST /api/v1/auth/verify-reset-code
 * @desc    Verify Reset code
 * @access  public
 */
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
    // 1) Get user based on reset code and hashed reset code.
    const { resetCode } = req.body;

    const hashedResetCode = crypto
        .createHash('sha256')
        .update(resetCode)
        .digest('hex');

    const user = await User.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ApiError('Reset code invalid or expired', 400));
    }

    // 2) If reset code valid.
    user.passwordResetVerified = true;
    await user.save();

    // 3) Response
    res.status(200).json({
        status: 'success',
        message: 'Reset code verified successfully'
    })
});

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password
 * @access  public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // 1) Get user based on email (include reset fields if select:false in schema)
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email }).select(
        '+passwordResetCode +passwordResetExpires +passwordResetVerified +password'
    );

    if (!user) {
        return next(new ApiError('No user found for this email', 404));
    }

    // 2) Check if reset code verified
    if (!user.passwordResetVerified) {
        return next(new ApiError('Reset code not verified', 400));
    }

    // 3) Update password
    user.password = newPassword;

    // 4) Clear reset fields so they can't be reused
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    // 5) if everythings is ok, Generate new token after password change
    const token = generateToken(user._id);

    // 6) Response
    res.status(200).json({
        status: 'success',
        message: 'Password reset successfully. You can now log in with your new password.',
        token
    })
});