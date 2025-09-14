const jwt = require('jsonwebtoken');

/**
 * @description Generate Access & Refresh tokens
 */
exports.generateTokens = (payload) => {

    const accessToken = jwt.sign(
        { userId: payload },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRES_IN, //15 min
            algorithm: 'HS256'
        }
    );

    const refreshToken = jwt.sign(
        { userId: payload },
        process.env.JWT_REFRESH_SECRET_KEY,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN, //7d,
            algorithm: 'HS256'
        }
    )

    return { accessToken, refreshToken };
};

/**
 * @description Helper function: Set refresh token as httpOnly cookie
 */

exports.setRefreshCookie = (res, refreshToken) => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == 'production', // works with https only in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

/**
 * @description Helper function: Safely clear refresh token cookie (used in logout & token revocation)
 */
exports.clearRefreshCookie = (res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
};

/**
 * @description Helper: Verify a token (Access or Refresh)
 */
exports.verifyToken = (token, secretKey) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        throw error;
    }
};